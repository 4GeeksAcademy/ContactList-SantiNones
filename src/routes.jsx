
import React from "react";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { ContactList } from "./pages/ContactList";
import AddContact from "./pages/AddContact";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        <Route index element={<ContactList />} />
        <Route path="add" element={<AddContact />} /> 
        <Route path="edit/:contactId" element={<AddContact />} />
      </Route>
    )
);