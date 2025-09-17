import React, { useReducer, createContext } from "react";
import { initialStore, actions } from "../store";

export const Context = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_CONTACTS:
      return { ...state, contacts: action.payload };

    case actions.ADD_CONTACT:
      // agrega al final
      return { ...state, contacts: [...state.contacts, action.payload] };

    case actions.DELETE_CONTACT:
      // elimina por id
      return {
        ...state,
        contacts: state.contacts.filter((c) => String(c.id) !== String(action.payload)),
      };

    case actions.UPDATE_CONTACT:
      // reemplaza el contacto por id
      return {
        ...state,
        contacts: state.contacts.map((c) =>
          String(c.id) === String(action.payload.id) ? action.payload : c
        ),
      };

    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, initialStore);
  return <Context.Provider value={{ store, dispatch }}>{children}</Context.Provider>;
};