import React, {useState} from 'react';

function SearchFeatureRecipe(props) {
    const [SearchTerm, setSearchTerm] = useState('');

    const searchHandler = (event) => {
        setSearchTerm(event.currentTarget.value);
        props.refreshFunction(event.currentTarget.value);
    };

    return (
        <input
            type="search"
            placeholder="search..."
            id="searchInput"
            value={SearchTerm}
            onChange={searchHandler}
        />
    );
}

export default SearchFeatureRecipe;