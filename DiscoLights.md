# Controllable Disco Lights

## Introduction @showdialog
This tutorial shows how to make a controllable 'Disco Lights' project. 
It is based on the existing example project https://microbit.org/projects/make-it-code-it/disco-lights/
We will extend this example to allow the style of the disco lights to be controlled from and external web interface.
We will also control the sensitivity of the audio sensor

## Step 1: Showing Lights

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

## Step 2: Reacting to Sound

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

## Step 3: Adjust sensitivity

Add a variable called sensitivity by clicking on ``||Variables:Make a Variable||``.
At the top of the ``||on start||`` block put ``||Variables:set sensitivity to 255||``
Replace ``||input:soundlevel||`` with  ``||Math:multiply||``.
In the first slot of the multiply block put back ``||input:soundlevel||``.
In the second slot put ``||Math:divide||``.
In the first slot of the divide block put the new variable ``||Variables:sensitivity||``.
In the second slot of the divide block put 255

By setting the sensitivity to different values between 0 and 255 in the ``||on start||`` block 
you can change how sensitive to sound the lights are.

```blocks
let sensitivity = 255
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
basic.forever(function () {
    led.setBrightness(input.soundLevel() * (sensitivity / 255))
})
```

## Step 4: Listen for serial messages over USB
Click on ``||Advanced||`` and grab a ``||Serial:serial on data received||`` 
and select the ``||new line ( )||`` option.

Make a new variable called ``||Variables:serialLineReceived||``.
In the ``||Serial:serial on data received||`` block put ``||Variables:set serialLineReceived||``
to the value ``||Serial:serial read until newline ( )||``.

This means whenever new characters are received via USB, the program will wait until
a newline character is received, and then set the variable ``||serialLineReceived||``
to whatever characters have accumulated since the previous newline character. This is
like reading a stream of characters one line at a time.

```blocks
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    serialLineReceived = serial.readUntil(serial.delimiters(Delimiters.NewLine))
})
let serialLineReceived = ""
let sensitivity = 0
sensitivity = 255
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
basic.forever(function () {
    led.setBrightness(input.soundLevel() * (sensitivity / 255))
})
```

## Step 4: Split the line of serial data into commands
We will create a simple command language for controlling the Disco Lights.
The microbit will listen for the commands "heart", "diamond" and "square".
When it receives one of these commands it will change the shape of the lights to match.

We will also listen for the command "sensitivity" followed by a number between 0 and 255
In order to be able to split apart the word sensitivity from the number that follows it, 
we need to 'split' the string value stored in ``||Variables:serialLineReceived||``.

From the ``||Text||`` menu grab a ``||Text:split at||`` block.
Set the first slot to ``||Variables:serialLineReceived||``.
Set the second slot to " ". That's a string with a single space character in it.

Make a new variable called ``||Variables:commandParts||``.
Set this variable to the result of the split block.

```blocks
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    serialLineReceived = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    commandParts = serialLineReceived.split(" ")
})
let commandParts: string[] = []
let serialLineReceived = ""
let sensitivity = 0
sensitivity = 255
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
basic.forever(function () {
    led.setBrightness(input.soundLevel() * (sensitivity / 255))
})

```

## Step 5: Extract the command itself
Now every time a line of characters is received over the serial port connection
(i.e. over the USB cable) the program will split the line into parts, and store those
parts in ``||Variables:commandParts||``. This variable is an Array. 

If the command is setting the sensitivity, then the first element of this Array will be the string "sensitivity"
and the second element of the Array will be a number value between 0 and 255.

If the command is "heart" or "diamond" or "square", then the Array ``||Variables:commandParts||``
will only have a single element; a string containing "heart" or "diamond" or "square".

So some lines just have a single word, which is the command itself. Some other lines
may have the command word and an extra value.

In either case, the first element of the Array ``||Variables:commandParts||`` is the command itself.
We can extract this from the array using ``||Arrays:get value at||``. Put
``||Variables:commandParts||`` in the first slot of this block, and put 0 in the second slot.
Computer languages often start counting from 0, so the first element of an array is the element at position 0.
Store this first element in a new variable called ``||Variables:command||``.

```blocks
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    serialLineReceived = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    commandParts = serialLineReceived.split(" ")
    command = commandParts[0]
})
let commandParts: string[] = []
let command = ""
let serialLineReceived = ""
let sensitivity = 0
sensitivity = 255
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
basic.forever(function () {
    led.setBrightness(input.soundLevel() * (sensitivity / 255))
})
```


## Step 6: Obey the command
Depending on which command is received, we take different actions. So we want an
if/else block. Grab a ``||Logic:if then||`` block, and replace "true" with the comparison block
``||Variables:command||`` = "heart".
In the empty slot in the if/else block put ``||Basic:show icon||`` and select a heart shaped icon.

Click on the + sign to add another "else if" slot to the if/else block. 
Copy the comparison and show icon blocks from above, replacing "heart" with "diamond",
and replacing the heart shaped icon with a diamond shaped icon. And do this again with "square"

```blocks
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    serialLineReceived = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    commandParts = serialLineReceived.split(" ")
    command = commandParts[0]
    if (command == "heart") {
        basic.showIcon(IconNames.Heart)
    } else if (command == "diamond") {
        basic.showIcon(IconNames.Diamond)
    } else if (command == "square") {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else {
        
    }
})
let command = ""
let commandParts: string[] = []
let serialLineReceived = ""
let sensitivity = 0
sensitivity = 255
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
basic.forever(function () {
    led.setBrightness(input.soundLevel() * (sensitivity / 255))
})
```

## Step 7: Don't forget the sensitivity command
We need to add an extra clause into our if/else conditional block, to take care of the
sensitivity command.

Click on the + sign at the bottom of the if/else block to add another "else if" clause.
Replace true with the comparison ``||Variables:command||`` = "sensitivity"

Remember that the sensitivity command expects to be followed by a number between 0 and 255.
But it is worth checking it really did receive this second part of the command. We can checking
the length of the ``||Variables:commandParts||`` array to make sure there is a second part to this command.
In the newly "else if" slot put another ``||Logic:if||`` block. Inside the if clause put a comparison block
checking whether something is greater than 1.  And in the first slot of this conditional
we put an  ``||Array:length of array||`` block, and choose commandParts from the dropdown list.

This conditional will be true if the command has at least two parts. In this case we will 
interpret the second part as a number representing the desired sensitivity. To extract it we 
need to get the second element of the ``||Variable:commandParts||`` array using ``||Arrays:get value at||`` selecting
this variable in the first slot, and with the number 1 in the second slot (remember counting of Arrays starts
at 0, so the second element is at position 1).

Finally we need to reinterpret the string value we extract as a number. For this we use the 
``||Text:parse to number||`` block

```blocks
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    serialLineReceived = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    commandParts = serialLineReceived.split(" ")
    command = commandParts[0]
    if (command == "heart") {
        basic.showIcon(IconNames.Heart)
    } else if (command == "diamond") {
        basic.showIcon(IconNames.Diamond)
    } else if (command == "square") {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else if (command == "sensitivity") {
        if (commandParts.length > 1) {
            sensitivity = parseFloat(commandParts[1])
        }
    } else {
        
    }
})
let command = ""
let commandParts: string[] = []
let serialLineReceived = ""
let sensitivity = 0
sensitivity = 255
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
basic.forever(function () {
    led.setBrightness(input.soundLevel() * (sensitivity / 255))
})
```


## Step 8: Unexpected commands
We are listening for four particular commands: "heart", "diamond",  "square", "sensitivity".
What if we receive an unexpected command, not in this list. At the moment the program will
just ignore it. But it might be helpful to alert ourselves in this case. This way if the code
that is sending the commands has an error (like it accidentally spells diamond "daimond")
it will be easier to debug.  So lets print out any unexpected command as a scrolling string
on the microbit.

In the empty "else" slot for the command conditional, put a ``||Basic:show string||`` block
and choose ``||Variables:command||``.

```blocks
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    serialLineReceived = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    commandParts = serialLineReceived.split(" ")
    command = commandParts[0]
    if (command == "heart") {
        basic.showIcon(IconNames.Heart)
    } else if (command == "diamond") {
        basic.showIcon(IconNames.Diamond)
    } else if (command == "square") {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else if (command == "sensitivity") {
        if (commandParts.length > 1) {
            sensitivity = parseFloat(commandParts[1])
        }
    } else {
        basic.showString(command)
    }
})
let command = ""
let commandParts: string[] = []
let serialLineReceived = ""
let sensitivity = 0
sensitivity = 255
basic.showLeds(`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
basic.forever(function () {
    led.setBrightness(input.soundLevel() * (sensitivity / 255))
})
```

Step 9:  That's it!
The microbit project is now ready.  Download it onto your microbit.
However, in order to actually see it in action, you will need a web interface that sends these
commands to the microbit.
An example web interface for doing this is available 
https://github.com/dr-offig/DES221_2023/releases/tag/1.0.0
Download the zip file, extract it, and open index.html in Google Chrome. Read the README.md
file for instructions on how to use this web interface.  Note that it has only been tested to work
in Google Chrome.  It uses the WebSerial API to communicate with the microbit, and not
all browsers support that yet.
