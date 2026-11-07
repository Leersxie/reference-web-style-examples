import { Shell } from './components/Shell'
import { Home } from './pages/Home'
import { Channels } from './pages/Channels'
import { ChannelDetail } from './pages/ChannelDetail'
import { Terminal } from './pages/Terminal'
import { Lab } from './pages/Lab'
import { useTransition } from './transition/TransitionProvider'

export default function App() {
  const { route } = useTransition()

  return (
    <Shell>
      {route.name === 'home' && <Home />}
      {route.name === 'channels' && <Channels />}
      {route.name === 'channel' && <ChannelDetail key={route.param} />}
      {route.name === 'terminal' && <Terminal />}
      {route.name === 'lab' && <Lab />}
    </Shell>
  )
}
