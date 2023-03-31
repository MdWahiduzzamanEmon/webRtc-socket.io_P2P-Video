import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PeerProvider from "./Components/Context/PeerContext/PeerContext";
import SoketProvider from "./Components/Context/SocketContext/SocketContext";
import Home from "./Components/Home/Home";
import Room from "./Components/Home/Room";

function App() {

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/room/:roomId",
      element: <Room />,
    }
  ])

  return (
    <div>
      <SoketProvider>
        <PeerProvider>
          <RouterProvider router={routes} />
        </PeerProvider>
      </SoketProvider>
    </div>
  )
}

export default App
