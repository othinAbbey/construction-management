import { useState } from "react";
// import "./App.css";
import { useForm } from "@mantine/form";
import { NumberInput, TextInput, Button, Box } from "@mantine/core";
// import Navbars from "./componenets/navigation";

function App() {
  // const [data, setData] = useState({
  //   name: "",
  //   email: "",
  //   age: 0,
  // });
  // function handleChanges(event) {
  //   const key = event.target.name;
  //   const value = event.target.value;
  //   setData({
  //     ...data,
  //     [key]: value,
  //   });
  // }
  // // const handleChanges = (event) => {
  // //   const { key, value } = event.target;
  // //   setData({
  // //     ...data,
  // //     [key]: value,
  // //   });
  // // };
  // // const form = useForm({
  // //   initialValues: { name: "", email: "", age: 0 },
  // //   // functions will be used to validate values at corresponding key
  // //   // validate: {
  // //   //   name: (value) =>
  // //   //     value.length < 2 ? "Name must have at least 2 letters" : null,
  // //   //   email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
  // //   //   age: (value) =>
  // //   //     value < 18 ? "You must be at least 18 to register" : null,
  // //   // },
  // // });
  // return (
  //   <Box maw={320} mx="auto">
  //     <form>
  //       <TextInput label="Name" placeholder="Name" onChange={handleChanges} />
  //       <TextInput
  //         mt="sm"
  //         label="Email"
  //         placeholder="Email"
  //         onChange={handleChanges}
  //       />
  //       <NumberInput
  //         mt="sm"
  //         label="Age"
  //         placeholder="Age"
  //         min={0}
  //         max={99}
  //         onChange={handleChanges}
  //       />
  //       <Button type="submit" mt="sm">
  //         Submit
  //       </Button>
  //     </form>
  //   </Box>
  // );
}

export default App;
