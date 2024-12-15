import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@components/components/ui/avatar";

import "./App.css";

function App() {
  return (
    <Avatar className="w-16 h-16 bg-gray-200">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

export default App;
