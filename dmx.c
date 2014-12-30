/*
 * Digital AC Dimmer
 *
 * Copyright (c) 2005-2006 Chris Fallin <chris@cfallin.org>
 * Placed under the modified BSD license
 *
 * dmx.c: DMX-512 receiver module
 */

#include "dmx.h"
#include "dim.h"
#include <avr/io.h>
#include <avr/interrupt.h>
#include <avr/signal.h>


static char start_code;

// DMX protocol state: -1 is awaiting the start code, 0-511 means we're waiting
// for that channel's data, and anything else is an invalid (erroneous) state
static int cur_addr;

void dmx_initialize()
{
  // PC0-PC5 are connected to the address-setting jumpers
  DDRC = (DDRC & ~0x3f) | 0x00; // PC0-PC5: inputs
  PORTC = (PORTC & ~0x3f) | 0x3f; // PC0-PC5: enable internal pull-ups

  PORTD = PORTD & ~0x10; // PD4 = 0: 75176 always in receive mode
  DDRD = (DDRD & ~0x13) | 0x12; // PD1, PD4 out; PD0 in

  UBRRH = 0;
  UBRRL = 3; // gives 250kbps for a 16MHz system clock
  UCSRA = 0x00;
  UCSRB = 0x90; // only receiver enabled; RX interrupt enabled
  UCSRC = 0x8e; // 8 data bits, 2 stop bits

}

static char dmx_state = 0; // 0 is waiting for start byte, 1 for data,
                           // -1 for invalid (wait for break)
static int dmx_addr = 0;


SIGNAL(SIG_UART_RECV)
{
  unsigned char rx_byte, status;

  // pull the received byte from the FIFO
  status = UCSRA;
  rx_byte = UDR;

  // check for a frame error: this indicates a 'break' received, so wait
  // for a start byte.
  if(status & (1 << FE))
  {
    // after a break, await the start code
    dmx_state = 0;
    return;
  }

  // check for an overrun: in this case, we have an invalid state, so
  // we must wait for the next break.
  if(status & (1 << DOR))
  {
    dmx_state = -1;
    return;
  }

  // if we got a byte, process the byte now
  if (dmx_state == 0)
  {
    // got the start byte
    if (rx_byte == 0)
    {
      dmx_state = 1;
      dmx_addr = 0;
    }
    else
      dmx_state = 0;
  }
  else if (dmx_state == 1)
  {
    int curaddr = dmx_addr++;
    int myaddr = (~PINC & 0x3f);

    if (curaddr == myaddr)
      dim_set_level(rx_byte);
  }
}
