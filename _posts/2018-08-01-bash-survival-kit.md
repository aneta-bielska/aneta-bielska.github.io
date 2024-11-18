---
layout: post
title: "Bash - survival kit"
author: "Aneta"
categories: journal
tags: [programming]
image: bash.jpg
---

## Table of Contents
- [Getting Started with Bash](#getting-started-with-bash)
- [Essential Commands](#essential-commands)
- [File Management](#file-management)
- [Process Management](#process-management)
- [Scripting Basics](#scripting-basics)
- [Useful Tips & Tricks](#useful-tips--tricks)

## Getting Started with Bash

Bash is the shell language of choice for many, pre-installed on most Unix-like systems, including Linux and macOS. To check your Bash version, simply open a terminal and type:

```bash
bash --version
```

## Essential Commands

Mastering these basic commands is the first step in your Bash journey.

```bash
# Command - Description

ls     # Lists files and directories
cd     # Changes the directory
pwd    # Prints the current directory
echo   # Outputs text to the console
cat    # Displays file contents
mkdir  # Creates a new directory
rm     # Deletes files or directories
cp     # Copies files or directories
mv     # Moves or renames files or directories
```


## File Management

File and directory manipulation is where Bash really shines. Here are some key commands for handling files:

```bash
# Listing Files by Size:
# This lists files in the current directory, sorted by size in human-readable format.
ls -lhS

# Finding Files:
find . -name "*.txt"

# This searches for all .txt files in the current directory and its subdirectories.
# Deleting Files Older Than 7 Days
# Useful for clearing out old log files or temporary files.
find /path/to/dir -type f -mtime +7 -exec rm {} \;
```

## Process Management

Managing running processes is essential for understanding what’s happening on your system.

```bash
# List all running processes with detailed information.
ps aux

# Use grep to filter the output
ps aux | grep 12345

# Killing a Process by PID
# Replace <PID> with the Process ID. Use with caution.
kill -9 <PID>
```

## Scripting Basics

With Bash, you can automate tasks using scripts. Here’s a quick look at creating and running a basic script:


```bash
# Create a New Script:
nano my_script.sh

# Add Basic Script:
#!/bin/bash
echo "Hello, World!"

# Make it Executable:
chmod +x my_script.sh

# Run the Script:
./my_script.sh
```

## Variables and Loops

Bash variables make scripts more dynamic. Here’s an example using variables and a `for` loop:

```bash
#!/bin/bash

name="Developer"
for i in {1..5}; do
    echo "Hello, $name! Count: $i"
done
```

## Useful Tips & Tricks

These tips can enhance your Bash experience and productivity.

Use `Ctrl + r` to search through your command history, and `!!` to repeat the last command.


```bash
# Aliases let you create shortcuts for commands you use frequently.
# Add them to ~/.bashrc
alias ll='ls -la'
alias gs='git status'

# Remember to refresh the shell configuration by sourcing the file:
source ~/.bashrc

# You can redirect output of a command to a file:
echo "This will go to a file" > output.txt

# Append to an existing file using >>:
echo "This is appended" >> output.txt

# Use && and || for conditional execution:
mkdir my_directory && echo "success" || echo "fail"
```

That's all for today. Happy scripting!


