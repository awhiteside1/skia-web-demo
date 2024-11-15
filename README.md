# Native Skia Example Repo

## Purpose

Minimal example to validate issues when using skia on web, in particular `Skia.Surface.MakeOffscreen()`, despite the
same usage working fine on native. Each variant draws the same image using a slightly different approach to rule out
other issues.

### Motivation

In another app, I'm using user input to draw on the canvas, clipped by a mask that's generated from the underlying image
based on what region they started drawing in. Currently, this is an Image that's masking (so using layers), but it seems
to work fine incrementally as the user adds paths.

The problem is when the user loads a previous image with many layers, and the app rebuilds the canvas layer by layer
masking and drawing (since i'm storing only the path data as the mask can be derived). Using an offscreen surface / the
GPU is orders of magnitude faster than an CPU based surface (cause duh), however when I try to render an image created
from an offscreen surface on web, I get a white screen. The same code works fine on native.

My current workaround is to initialize the surface differently based on the platform, but it's not really viable. The alternatives I have are 
- Trace the masks serverside so I can remove the bitmap masking that makes the CPU too slow
- Try rending to canvas kit directly
- Get better at shaders and composite the mask there

## Goal

- Create an offscreen canvas
    - `const surface = Skia.Surface.MakeOffscreen()`
- Which can be drawn to by iteration over some data
    - `data.map(layer=> surface.canvas.drawImage(layer))`
    - in reality there are multiple operations happening per layer
- And can produce an image composing all layers
    - `const mergedImage = surface.makeImageSnapshot()`
- Which can be displayed on the primary canvas
    - `<Canvas><Image image={mergedImage}/></Canvas>`

### Variants Tested

| Number | Description                                     | Problems               |
|--------|-------------------------------------------------|------------------------|
| 1      | uses drawAsImage() base case                    |                        |
| 2      | creates an offscreen surface per operation      | Does not render on web |
| 3      | creates a CPU surface per operation             | Slow                   |
| 4      | creates a single CPU surface which is reused    | Still Slow             |
| 5      | creates a single offscreen surface, then reused | Does not render on web |

### Created From

1. `npx create-expo-app@latest SkiaExample`
2. `npx expo install @shopify/react-native-skia` + Web Canvas Setup
3. Added Examples to `(tabs)/index.tsx`
    4. Component code is all in `components/skia`

### Current Behavior

| iOS                                                                                           | Android                                                                                       |
|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| <img src="https://i.imgur.com/Uef0u25.png" style="max-height: 400px; display: inline-block;"> | <img src="https://i.imgur.com/yH5gi2L.png" style="max-height: 400px; display: inline-block;"> |

| Web                                 (Arc/Chrome OSX M2 Max)           |
|-----------------------------------------------------------------------|
| <img src="https://i.imgur.com/9s8hCZZ.png" style="max-width: 600px" > | 
 
## Other Misc. Things I've tried

### Continuous Mode 

Doesnt seem to have any effect (not that I'd expect it to given updates are actively invoked)

### Change which thread the surface is created on

I.e. Create on the JS Thread
```ts
const surface = useSharedValue(Skia.Surface.MakeOffscreen())
     // ... later in an effect
runOnUI(someWorklet)({surface})
```
vs create on UI Thread

```ts
const someWorklet = ()=>{
    "worklet"
  const surface = Skia.Surface.MakeOffscreen()
}
```

This doesnt seem to matter in any case - it neither breaks CPU surfaces, nor fixes GPU surfaces, which probably means those calls invoke the backend on the right thread explicitly, then its just a pointer being passed by reanimated. 


### Debugged the MakeOffscreen function 

As far as I can tell it follows the happy path all the way, and works up until snapshotting the image. 

### Calling makeNonTextureImage() after generating the image

Based on https://sourcegraph.com/github.com/Shopify/react-native-skia@main/-/blob/packages/skia/src/renderer/Offscreen.tsx?L43-45

ANNNDDDDD IT LIVES!



