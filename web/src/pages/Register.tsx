import { FormEvent, useState } from "react";
import { api } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (confPassword != password) {
      return window.alert("As senhas são diferentes!");
    }
    try {
      await api
        .post("register", {
          email,
          password,
          username,
        })
        .then((response) => {
          Cookies.set("jwt", response.data.token, {
            expires: 7,
            path: "/",
          });
          console.log(response);
        });

      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="email">Nome de usuário:</label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Digite seu nome"
          required
          className="text-slate-900"
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
          className="text-slate-900"
        />
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Crie uma senha"
          required
          className="text-slate-900"
        />
        <label htmlFor="confPassword">Confirme sua senha:</label>
        <input
          type="password"
          name="confPassword"
          id="confPassword"
          onChange={(e) => setConfPassword(e.target.value)}
          placeholder="Confirme sua senha"
          required
          className="text-slate-900"
        />

        <input type="submit" />
      </form>
    </div>
  );
}
