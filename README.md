# changelog.sketchplugin
## What is this?
A simple Sketch plugin to generate and maintain artboard-based changelogs.

Every page in Sketch can have a changelog. If you run the plugin from a page without a changelog, it will create a new one. This is by design.  

## Why not [Sketch Git](https://github.com/mathieudutour/git-sketch-plugin)?
There’s nothing wrong with Git, it’s great! It’s just a bit too much for my needs. I prefer to keep changelogs and artboards in the same location so you don’t have to go back and forth from browser to Sketch. I added timestamps in the changelog so if you need to go back to a specific version you cross check it with Box, Dropbox or Time machine to go back to the version you need.


## Extra things: 
- You can tweak the design of the header as much as tou want. As long as you don’t change the names of the layers, the plugin will update them correctly. You can also make the header bigger and the plugin will abutomatically place commits and details in the right position under it. There’s no template for the header at the moment: every new changelog will go back to the default one.
![Header styles](http://i.imgur.com/N98h1wS.png)
- You can stretch the arboard to account for very long changelogs. Or you can simply remove the ones you don’t need anymore. 
- The changelog title always matches the page title.

## TODO:
- Support for multi-line commits.
