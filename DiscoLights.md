# Controllable Disco Lights

## Introduction @showdialog
This tutorial shows how to make a controllable 'Disco Lights' project. 
It is based on the existing example project https://microbit.org/projects/make-it-code-it/disco-lights/
We will extend this example to allow the style of the disco lights to be controlled from and external web interface.
We will also control the sensitivity of the audio sensor

## Step 1

Get a ``||basic:show leds||`` block and place it in the ``||on start||``. 
Select all of the LEDS by dragging the mouse across them

```blocks
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
```

## Step 2

Get an ``||led:set brightness||`` block (you might need to click on "... more" to see it) 
and place it in the ``||forever||`` block.

Get an ``||input:soundlevel||`` block and place it in the value slot of ``||led:set brightness||``. 

```blocks
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
basic.forever(function () {
    led.setBrightness(input.soundLevel())
})
```
