import { createContext, useState } from 'react';

const GameContext = createContext();

const GameProvider = ({ children }) => {
    const [game, setGame] = useState({});

    const refreshGame = async () => {
        try {
            const res = await fetch('/api/getGame');
            const game = await res.json();
            setTodos(game);
        } catch (err) {
            console.error(err);
        }
    };

    const playBid = async (bid) => {
        try {
            game
            const res = await fetch('/api/createTodo', {
                method: 'POST',
                body: JSON.stringify({ description: todo }),
                headers: { 'Content-Type': 'application/json' },
            });
            const newTodo = await res.json();
            setTodos((prevTodos) => {
                const updatedTodos = [newTodo, ...prevTodos];
                return updatedTodos;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const updateTodo = async (updatedTodo) => {
        try {
            await fetch('/api/updateTodo', {
                method: 'PUT',
                body: JSON.stringify(updatedTodo),
                headers: {
                    'content-type': 'application/json',
                },
            });

            setTodos((prevTodos) => {
                const existingTodos = [...prevTodos];
                const existingTodo = existingTodos.find(
                    (todo) => todo.id === updatedTodo.id
                );
                existingTodo.fields = updatedTodo.fields;
                return existingTodos;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await fetch('/api/deleteTodo', {
                method: 'Delete',
                body: JSON.stringify({ id }),
                headers: { 'Content-Type': 'application/json' },
            });

            setTodos((prevTodos) => {
                return prevTodos.filter((todo) => todo.id !== id);
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <TodosContext.Provider
            value={{
                todos,
                setTodos,
                refreshTodos,
                updateTodo,
                deleteTodo,
                addTodo,
            }}
        >
            {children}
        </TodosContext.Provider>
    );
};

export { GameProvider, GameContext };
