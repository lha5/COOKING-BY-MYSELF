import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';

import '../../../assets/css/recipeDetail.scss'

function RecipeDetailPage(props) {
    const recipeId = props.match.params.recipeId;
    const [recipeDetails, setRecipeDetails] = useState({});
    const [writerInfo, setWriterInfo] = useState({});

    useEffect(() => {
        axios.get(`/api/recipe/recipe_by_id?id=${recipeId}&type=single`)
            .then(response => {
                if (response.data.success) {
                    setRecipeDetails(response.data.recipe[0]);
                    setWriterInfo(response.data.recipe[0].writer);
                } else {
                    alert('레시피 페이지를 가져오지 못했습니다.');
                }
            });
    }, []);

    const testCheck = () => {
        console.log('///////', recipeDetails);
    }

    function createHTML() {
        return {__html: recipeDetails.content};
    }

    return (
        <div className="recipeDetail">
            <div className="recipeTitle" onClick={testCheck}>
                {recipeDetails.title}
            </div>
            <div className="recipeInfo">
                <span>
                    {writerInfo.name}
                </span>
                <span>
                    {recipeDetails.updatedAt}
                </span>
                <span>
                    {recipeDetails.views}
                </span>
            </div>
            <div className="recipeContent" dangerouslySetInnerHTML={createHTML()} />
        </div>
    );
}

export default RecipeDetailPage;