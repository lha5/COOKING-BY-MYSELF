import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import DataFilter from './DataFilter';
import SearchFeatureRecipe from './SearchFeatureRecipe';
import { category } from './Data';

import '../../../assets/css/recipePage.scss'

function RecipePage(props) {
    const [recipes, setRecipes] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(8);
    const [postSize, setPostSize] = useState(0);
    const [Filters, setFilters] = useState({
        category: []
    });
    const [SearchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let variables = {
            skip: Skip,
            limit: limit
        };
        getRecipes(variables);
    }, []);

    const getRecipes = (variables) => {
        axios.post('/api/recipe/recipes', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.recipesInfo);
                    if (variables.loadMore) {
                        setRecipes([...recipes, ...response.data.recipesInfo]);
                    } else {
                        setRecipes(response.data.recipesInfo);
                    }
                    setPostSize(response.data.postSize);
                } else {
                    alert('레시피 목록 로딩 실패');
                }
            });
    };

    const loadMoreHandler = () => {
        let skip = Skip + limit;

        let variables = {
            skip: skip,
            limit: limit,
            loadMore: true,
        };
        getRecipes(variables);
        setSkip(skip);
    };

    const renderCards = recipes.map((recipe, index) => {
        return <div className="recipeContainer" key={index}>
            <a href={`/recipe/${recipe._id}`}>
                <div className="recipePicture">
                    <img alt="recipe_image" src={`http://localhost:5000/${recipe.images[0]}`} />
                </div>
                <div className="recipeTitle">
                    {recipe.title}
                </div>
                <div className="recipeInfo">
                <span>
                    {recipe.writer.name}
                </span>
                    <span>
                    {moment(recipe.updatedAt).format('YYYY[/]MM[/]D')}
                </span>
                </div>
            </a>
        </div>
    });

    const showFilteredResult = (filters) => {
        let body = {
            skip: 0,
            limit: limit,
            filters: filters
        };

        getRecipes(body);
        setSkip(0);
    };

    const handleFilters = (filters, classification) => {
        const newFilters = {...Filters};
        newFilters[classification] = filters;

        showFilteredResult(newFilters);
    };

    const updateSearchTerm = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);

        let body = {
            skip: 0,
            limit: limit,
            filters: Filters,
            searchTerm: newSearchTerm
        };

        setSkip(0);
        setSearchTerm(newSearchTerm);
        getRecipes(body);
    };

    return (
        <div className="recipeList">
            <div className="pageTitle">
                레시피 공유
            </div>
            <div id="pageButton">
                <span onClick={() => props.history.push('/recipe/upload')} title="레시피 올리기"> + </span>
            </div>
            <div className="listFilter">
                <DataFilter list={category} handleFilters={filters =>handleFilters(filters, 'category')} />
            </div>
            <div className="listSearch">
                <SearchFeatureRecipe refreshFunction={updateSearchTerm} />
            </div>
            <div className="pageList">
                {renderCards}
            </div>
            <br />
            {postSize >= limit &&
                <div className="moreRecipes">
                    <span onClick={loadMoreHandler}>더보기</span>
                </div>
            }
        </div>
    );
}

export default RecipePage;