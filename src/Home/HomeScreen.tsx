import React, {useState} from "react";

import "./HomeScreen.css";

export const HomeScreen: React.FC = () => {


    return (
        <div className="home-container">
            <h1>Home Screen</h1>

            <SearchBarWithDropdown
                options={
                    [
                        "Juan Manuel Fangio",
                        "Ayrton Senna",
                        "Juan Domingo Perón",
                        "Juanetes en los pies",
                        "Jabón",
                        "No soy Juan",
                        "Juan Sebastián Verón",
                        "Jaime Lannister",
                        "Jorge Luis Borges",
                        "Jerónimo Stilton",
                        "Julián Álvarez",
                        "Jennifer López",
                        "José de San Martín",
                        "Jane Austen",
                        "Joaquín Sabina",
                        "James Bond",
                        "Jessica Rabbit",
                        "Julia Roberts",
                        "Justin Timberlake",
                        "Jimi Hendrix",
                        "Joan of Arc",
                        "James Cameron",
                        "Joe Biden",
                        "Johnny Depp",
                        "Joanne Rowling",
                        "Jim Carrey",
                        "Jack Nicholson",
                        "John Lennon",
                        "Jon Snow",
                        "Jules Verne",
                        "Jack Sparrow",
                        "Jeff Bezos",
                        "Jerry Seinfeld",
                        "Janet Jackson",
                        "Jane Goodall",
                        "Jason Bourne",
                        "Javier Bardem",
                        "Jared Leto",
                        "Jeremy Clarkson",
                        "Jon Hamm",
                        "Johnny Cash",
                        "Jürgen Klopp"
                    ]

                }
            />

        </div>
    );
}


const SearchBarWithDropdown = (props: { options: string[] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([] as string[]);
    const [showDropdown, setShowDropdown] = useState(false);

    const {options} = props;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value) {
            const filtered = options.filter((option) =>
                option.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredOptions(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleOptionClick = (option: string) => {
        setSearchTerm(option);
        setShowDropdown(false);
    };

    return (
        <div style={{position: "relative", width: "300px"}}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search..."
                style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box"
                    
                }}
            />
            {showDropdown && filteredOptions.length > 0 && (
                <ul
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        zIndex: 1000,
                        color: "black",
                    }}
                >
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBarWithDropdown;
