import { FormEvent, useState } from "react";
import { api } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
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
        });

      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }
  return (
    <div>
      <h1 className="font-semibold text-[2rem] text-center text-violet-500 mb-6">
        Crie uma conta
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="email" className="mb-2 mt-2 font-semibold">
          Nome de usuário:
        </label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Digite seu nome"
          required
          className="text-zinc-400 border border-violet-500 bg-zinc-800 font-semibold rounded-lg px-4 py-2 hover:border-violet-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background"
        />
        <label htmlFor="email" className="mb-2 mt-2 font-semibold">
          Email:
        </label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
          className="text-zinc-400 border border-violet-500 bg-zinc-800 font-semibold rounded-lg px-4 py-2 hover:border-violet-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background"
        />
        <label htmlFor="password" className="mb-2 mt-2 font-semibold">
          Senha:
        </label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Crie uma senha"
          required
          className="text-zinc-400 border border-violet-500 bg-zinc-800 font-semibold rounded-lg px-4 py-2 hover:border-violet-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background"
        />
        <label htmlFor="confPassword" className="mb-2 mt-2 font-semibold">
          Confirme sua senha:
        </label>
        <input
          type="password"
          name="confPassword"
          id="confPassword"
          onChange={(e) => setConfPassword(e.target.value)}
          placeholder="Confirme sua senha"
          required
          className="text-zinc-400 border border-violet-500 bg-zinc-800 font-semibold rounded-lg px-4 py-2 hover:border-violet-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background"
        />

        <input
          type="submit"
          className="border border-violet-500 font-semibold rounded-lg px-6 py-4 mt-5 flex items-center justify-center gap-3 hover:border-violet-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
        />
        <div className="flex mt-2 gap-1 justify-center">
          <p>Ja tem uma conta?</p>
          <Link
            to={"/login"}
            className="text-violet-500 cursor-pointer hover:text-violet-300"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
