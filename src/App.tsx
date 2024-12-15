import "./App.css"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@components/components/ui/avatar"

function App() {
  return (
    <Avatar className="w-16 h-16 bg-gray-200">
      <AvatarImage src="https://github.com/shadcn.png" />

      <div></div>

      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}

export default App
