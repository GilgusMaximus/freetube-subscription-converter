# Freetube-Subscription-Converter
This program is a CLI that takes your old subscription database file and converts it into the subscription database format.

# Notice before usage

If you already have subscriptions in the rewrite of FreeTube, make a backup of the profiles.db file.
I do not take responsibility if an error occurs and your subscriptions are lost. 

# Usage
`./ft-sub-converter-win.exe -op './path/to/old/file/subscriptions.db' -np './path/to/new/file/profiles.db' -t`
 
The first two arguments `-op` and `-np` point towards the two files, and **must** be in this order.

The `-t` argument as **last** argument is optional, but tells the program to add the subscriptions to all the profiles they were part of in the old version.
So a channel in a profile 'Technology' and 'All Channels' will then be in these two profiles as well.
It does not matter whether the profiles exist beforehand or not.


Not using the -t argument creates a new profile called 'oldTube' where every subscription is put in.

 
