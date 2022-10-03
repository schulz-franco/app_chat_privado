import Lateral from "../components/lateral"
import Chat from "../components/chat"

import "../styles/home.scss"

const Home = () => {
  return (
    <div className="home-container">
      <div className="home">
        <Lateral />
        <Chat />
      </div>
    </div>
  )
}

export default Home