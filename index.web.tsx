import '@expo/metro-runtime'
import { App } from 'expo-router/build/qualified-entry'
import { renderRootComponent } from 'expo-router/build/renderRootComponent'

import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web'

LoadSkiaWeb({ locateFile: (file) => '/canvaskit.wasm' }).then(async () => {
	renderRootComponent(App)
})
