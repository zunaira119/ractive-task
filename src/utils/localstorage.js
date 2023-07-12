const localstorage = (name) => {
    
    function getAll(){
        const items = JSON.parse(localStorage.getItem(name))
        return items;
    }

    function setAll(items){
        console.log({ name, items })
        localStorage.setItem(name, JSON.stringify(items));
        return items;
    }

    function update(id, body){
        
        const items = JSON.parse(localStorage.getItem(name))

        body.id = id;
        const itemIndex = items.findIndex(e => e.id == id);

        items[itemIndex] = body;
        localStorage.setItem(name, JSON.stringify(items));

        return body;

    }

    return {
        getAll,
        update,
        setAll,
    }

}

export default localstorage