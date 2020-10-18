import axios from 'axios';
import { RECIPE_SERVER } from '../components/Config';

export function uploadRecipe(dataToSubmit) {
    const request = axios.post(`${RECIPE_SERVER}/upload`, dataToSubmit)
        .then(response => response.data);

    return {
        type: 'upload_recipe',
        payload: request
    }
}