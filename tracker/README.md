Update NodeJs

Download from https://nodejs.org/en/download/

Unpack and install into /usr/local/lib

Add to ~/.profile

PATH=/usr/local/lib/node-v16.16.0-linux-x64/bin:$PATH

To use (from within tracker dir):

$ npm install

$ npm run dev

Dependencies are captured in the 'packages.json'.