import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Context } from "../hooks/useGlobalReducer";
import { actions } from "../store";
import { API, AGENDA } from "../apiConfig";

export const AddContact = () => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { store, dispatch } = useContext(Context);
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // Precargar datos en modo edición
  useEffect(() => {
    const preload = async () => {
      if (!params.contactId) return;

      // 1) si vienes desde la lista, ya tienes el contacto en state
      if (location.state?.contactToEdit) {
        setContact(location.state.contactToEdit);
        return;
      }

      // 2) fallback: buscar contacto por id
      try {
        const res = await fetch(`${API}/contacts/${params.contactId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setContact(data.contact || data);
      } catch (err) {
        console.error("No pude precargar el contacto:", err);
      }
    };

    preload();
  }, [params.contactId, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // EDITAR
    if (params.contactId) {
      try {
        const res = await fetch(`${API}/contacts/${params.contactId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...contact, agenda_slug: AGENDA }), // ← importante
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const updated = data.contact || data;

        dispatch({ type: actions.UPDATE_CONTACT, payload: updated });
        navigate("/");
      } catch (error) {
        console.error("Error en la actualización:", error);
        alert("No se pudo actualizar el contacto.");
      }
      return;
    }

    // CREAR
    try {
      const res = await fetch(`${API}/agendas/${AGENDA}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const created = data.contact || data;

      dispatch({ type: actions.ADD_CONTACT, payload: created });
      navigate("/");
    } catch (error) {
      console.error("Error en la creación:", error);
      alert("No se pudo crear el contacto.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">
        {params.contactId ? "Edit Contact" : "Add a new contact"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            name="name"
            value={contact.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Enter phone"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter address"
            name="address"
            value={contact.address}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Save
        </button>

        <Link to="/" className="d-block mt-2 text-center">
          or get back to contacts
        </Link>
      </form>
    </div>
  );
};

export default AddContact;