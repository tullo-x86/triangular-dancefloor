
use <parts-lib.scad>;



for (i = [0 : 5])
{
    rotate(60 * i) equilateralTriangle();
}