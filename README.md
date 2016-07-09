# changelog.sketchplugin

![Changelog.sketchplugin gif](http://i.imgur.com/k8N1ssZ.gifv)

## What is this?
A simple Sketch plugin to generate and maintain artboard-based changelogs. 

You run it, it asks you what changed in your design, your name and it creates (or updates) an artboard with your commits.

Every page in your Sketch file has its own changelog. The changelog title is always synched with the title of the page it is in. There’s no global changelog for the whole file but only page specific ones.

The shortcut for running the changelog is ctrl+alt+C.

## A couple of extra things: 
- You can tweak the design of the header! As long as you don’t change the names of the layers, the plugin will update them correctly. You can also make the header bigger to add more stuff and the plugin will automatically place commits and details in the right position under it. There’s no template for the header at the moment: every new changelog will go back to the default one.

![Header styles](http://i.imgur.com/N98h1wS.png)

- You can stretch the arboard to make room for very long changelogs. Or you can simply remove the ones you don’t need anymore.
- Commits and details are in single, separate, text layers. It makes the managment of the content much easier.

## TODO:
- Hitting should run the plugin
- Support for multi-line commits.
- Support header templates (???)
- Implement optional event based commit: commit triggered at file save
