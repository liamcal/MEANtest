# Mean Stack Walkthrough 0
*Liam Callaway*

For internal project use only.

## Introduction

This is a precursor guide for getting setup with MEAN stack development. The purpose of this walkthrough is to step through the installation process of various tools. I've tested it on Windows 10 and MacOS Sierra, but it should be more or less similar on other operating systems.

## Terminology

Throughout the guide I'm going to be using the phrase *terminal* to refer to whatever command-line tool you might be using (cmd for windows, terminal for Mac) etc.

Whenever I specify a terminal command, I will prefix it with a `$` sign like so

` $ command `

The terminal prompt might be different for your environment. You do not need to type the `$` sign.

## Installing Node.js

Node is the javascript runtime engine we will be using for the web server. We will also be using the Node Package Manager (npm) for a lot server setup and maintenance.

First go to http://nodejs.ord/en and download the installer for the LTS version (currently 6.10.2).

Run the installer and select all the default settings.

Once that has finished, open up a terminal and run the command:

` $ npm -v `

If Node and npm have been installed correctly, you should see the version number. If it didn't work, check that the installation completed correctly, and that the directory for node has been added to your PATH variable.

## Installing MongoDB

MongoDB is our noSQL database system. We can run the database on a free service provider, but for simplicity during learning and early development, we'll just run the database locally.

### Windows

On Windows, navigate to http://mongodb.com/download-center and download the first of the available windows options. (Even though it says Windows Server, these are compatible with regular Windows too.)

Once the installer is downloaded, click through all the steps, selecting complete installation when prompted.

Next, we need to add MongoDB to our PATH variable (unlike Node, the Mongo installer doesn't do this automatically). Use Windows Explorer to navigate to `This PC`, then right-click and select `properties`. From the side-bar click `Advanced System Settings`, then click the button named `Environment Variables...`. In the System variables section, find the variable named `path` and click the `edit` button. Add the following string to the end of the path.

`;C:\Program Files\MongoDB\Server\3.4\bin\`

Make sure there is a semi-colon separating the new entry from the rest of the path. Also, be sure to check that MongoDB has in fact been installed in the above location. If for some reason it was installed elsewhere (or you have a version different to 3.4), you'll need to change the path to match that instead.

Next, we need to actually create a data directory for mongo to store it's data. To do this, use the command
` $ md \data\db `

This will create the data directory at the above location. This is the default location that mongo looks for, so don't change it to any other location.

Now try running the DB again
` $ mongod `

This time, you should be prompted to allow access through the Windows Firewall. Check both boxes (public and private networks), and then click accept.

After this, the DB should be running, and you should see a message saying `waiting for connections on port 27017`.

Mongo is now setup correctly! To quit the process, press Ctrl-C. To run it again at any time, just use the `$ mongod` command as before.

### MacOS

The recommended (and easiest) way to install MongoDB on Mac is to use the popular package manager `Homebrew`. You may already have it installed (to check, use `$ brew -v`.)

If you don't have it installed, there's a useful guide on how to get homebrew setup available at https://www.howtogeek.com/211541/homebrew-for-os-x-easily-installs-desktop-apps-and-terminal-utilities/.

Once you have confirmed you have Homebrew available, run the following command

`$ brew update`

`$ brew install mongodb --with-openssl`

Homebrew should now install the latest stable version of mongodb.

Next we ned to create the data directory for mongo to store it's data.

`$ mkdir -p /data/db`

*(Make sure you have read/write permissions on this directory)*

Now try running mongo using
`$ mongod`

If it doesn't work, you might not have your path settings correct. I'm fairly sure Homebrew should handle this for you. (I've had mongo installed for a while so can't remember if I had to change anything here...)

After this, the DB should be running, and you should see a message saying `waiting for connections on port 27017`.

Mongo is now setup correctly! To quit the process, press Ctrl-C. To run it again at any time, just use the `$ mongod` command as before.

## Installing Git

We will be using Git for our version control. It's not super important to get that installed now, but I figured I would include that in this guide too.

As an aside, it would be really good if everyone could learn how to use Git from the command-line. While GUI tools can be quite helpful, you need a reasonable understanding of what's happening under the hood to actually use them. A lot of people I've spoken to (including myself), said they actually found that learning to use it from the command-line actually made the whole process a lot more understandable for them.

I'm not going to write a guide to using Git. There's plenty of resources out there, including a cute little official interactive tutorial available at https://try.github.io/. I'm happy to teach people the basics individually if needed.

Now, back to installing it...

### Windows

Navigate to http://git-for-windows.github.io and click the download button. Run the installer and choose the default options (in particular, Use Git from Windows Command Prompt).

Open up a new terminal window and run  `$ git --version` to check git was installed correctly.

### MacOS

There's a reasonable chance you already have git installed, particularly if you installed the xcode tools as part of your homebrew installation. Check that it's not already present by using

`$ git --version`

If it's not there (and assuming you have Homebrew now), all you need to do to install git is

`$ brew install git `

(Thank god for package managers...)

If you really don't want to use homebrew, there's also a .dmg installer available from https://sourceforge.net/projects/git-osx-installer/files/
But I haven't used this myself so can't vouch for it.

## Credentials

You'll want to set things up so that git know who is making the commits. Go and make an account on GitHub if you haven't already, then run the following commands, substituting your own username and email.

`$ git config --global user.name "<username>"`
`$ git config --global user.email "<email>"`

## Tying it all Together

Let's use git to clone a copy of the repository this walkthrough and other related tests are being stored in. We'll then get one of the demos using Node and Mongo installed and running.

First, open up a terminal somewhere you would like these files to be stored. Then run

` $ git clone https://github.com/liamcal/MEANtest.git `

*(Don't worry if there's a few errors, the main files should have been checked out successfully)*

We're going to be running the `MongoTest` example (which is essentially what walkthroughs 1-3 will build up to), so `cd` into there.

An important point here is that the git repo contained all the project source code for this demo. However, it did not contain any of the external dependencies, which are usually stored in a `node_modules/` directory. This is because there are way too many files in here to feasibly keep under source control.

**NEVER ADD node_modules/ TO VERSION CONTROL!**


Luckily, node automatically keeps track of dependencies and other project related info in the `package.json` file. Even better, node can recreate and install these dependencies based on that file.

So once you're in the MongoTest directory, run the command

` $ npm install `

and watch as all the dependencies get installed. *(Again, don't worry about any minor warnings here, they're pretty normal)*

Now, make sure you have mongodb running in a **separate terminal** with ` $ mongod `. Then, back in the other terminal, run the server using

` $ node server.js `

You should get a confirmation message, indicating the server is running and listening for requests on port 3000.

So, open up your browser and navigate to `localhost:3000`, and you should see a nice little database demo, which will allow you to add and remove items from a list.


## Bonus Round - Atom Editor
I've been using the Atom text editor to write these guides and the tech prototypes. I think it's pretty cool, so if you don't already have strong feelings about your dev environment (or are interested in trying something new), I figured I might as well walk you through my setup.

First download the appropriate atom file from https://atom.io/. On Windows, run the setup executable, On Mac, unzip the file and add the .app file to your applications folder.

Open Atom, then click "Install A Package". There's many packages you may want, but I'll run through a couple that I think you'll find useful.

### platformio-ide-terminal (2.5)

This is so helpful. It allows you to open up a terminal from inside the editor. What's even better is you can have multiple terminal tabs (so one for mongodb and then another for the server), and be default they open up in your current working directory (so no complex `cd`ing every time you open a terminal.)

Search for the package and click the install button. Make sure you get the stable release and not the beta.

Once it's installed, click on the little plus button in the bottom right corner of your screen. Ta-da! Terminal! You can click the plus button again to launch additional terminals. You can switch between open terminals by clicking the little buttons next to the plus icon.

### Remote-FTP (0.10.7)

This is a useful package which will allow us to directly edit files on the NeCTAR cloud server. It will take a little bit to actually setup the connection, which I'll discuss later. But for now this is worth going ahead and installing.

### Script (3.14.1)

I usually just use the terminal to run any code I write. But there are various packages which you can use to run things like python scripts instead. The most popular of these is Script

### Other packages

There's heaps of other packages in Atom which you might find useful, particular for certain types of development. It's worth browsing the available/popular packages from time to time and you might find something else useful.

### Themes

I quite like the default theme, but if it's not your style there's a number of other themes to choose from and install.



## Conclusion

We've installed Node.js and MongoDB, and also setup git for our version control. We're going to need to use a lot more software as we develop our web application, but thankfully, the rest of the packages can be installed easily using `npm`. I'll cover them in later guides, where we setup our own web server from scratch.
