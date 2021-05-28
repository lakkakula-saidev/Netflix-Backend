
const getQuery = async (query) => {

    try {
        console.log('I am before')
        const response = await fetch(`http://www.omdbapi.com/?apikey=c992ec7c&s=${query}`);
        console.log('I am after')

        if (response.ok) {
            response = await response.json();
            return response.Search
        }

    } catch (error) {
        console.log('i am an error')
    }
}

export default getQuery