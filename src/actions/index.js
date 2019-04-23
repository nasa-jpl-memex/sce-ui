import * as types from '../reducers/types';
import * as env from '../utils/constants'
import axios from 'axios';
//var Database = require('arangojs').Database;

//var db = new Database('http://127.0.0.1:8529');
/*
db.createDatabase('sce').then(
    () => console.log('Database created'),
    err => console.error('Failed to create database:', err)
);*/

//db.useDatabase('sce');

//let collection = db.collection('models');

/*

collection.create().then(
    () => console.log('Collection created'),
    err => console.error('Failed to create collection:', err)
);
*/


/*let doc = {
    _key: 'firstDocument',
    a: 'foo',
    b: 'bar',
    c: Date()
};


collection.save(doc).then(
    meta => console.log('Document saved:', meta._rev),
    err => console.error('Failed to save document:', err)
);


collection.update('firstDocument', {d: 'qux'}).then(
    meta => console.log('Document updated:', meta._rev),
    err => console.error('Failed to update document:', err)
);


collection.document('firstDocument').then(
    doc => console.log('Document:', JSON.stringify(doc, null, 2)),
    err => console.error('Failed to fetch document:', err)
);*/

export const createNewModel = (name) => {
    return (dispatch) => {
        axios.get(env.API_URL+"/explorer-api/classify/createnew/"+name)
            .then(response => {
                response = {
                    type: types.NEW_MODEL,
                    payload: name
                }
                dispatch(response)
            })
    }
}

export const updateModel = (name, annotations) => {
    return (dispatch) => {
        axios.post(env.API_URL+"/explorer-api/classify/update/"+name, annotations)
            .then(response => {
                response = {
                    type: types.MODEL_STATS,
                    payload: response.data
                }
                debugger;
                dispatch(response)
            })
    }
}
export const fetchAllModels = () => {
    return (dispatch) => {
        axios.get(env.API_URL+"/explorer-api/classify/listmodels")
            .then(response => {
                response = {
                    type: types.MODEL_LIST,
                    payload: response.data
                }
                dispatch(response)
            })
    }
}

export const enableModel = (name) => {
    return (dispatch) => {
        try {
            const serializedState = JSON.stringify({current_model: name});
            localStorage.setItem('state', serializedState);
        } catch {
            // ignore write errors
        }
        let response = {
            type: types.ENABLE_MODEL,
            payload: name

        };
        dispatch(response)
    }
}
export const fetchNewTime = () => ({
    type: types.FETCH_NEW_TIME,
    payload: new Date().toString(),
})


export const searchFired = (b) => ({
    type: types.SEARCH_FIRED,
    payload: b
})

export const searchWebsites = (model, search_term) => {
    return (dispatch) => {
        axios.get(env.API_URL+"/search/"+model+"/" + search_term)
            .then(response => {
                let jdata = response.data;

                response = {
                    type: types.SEARCH_RESULTS,
                    payload: jdata
                };
                dispatch(response)
            }).then(response => {
                dispatch(searchFired(false))
            })
            .catch(error => {
                throw(error);
            })

    }
};

export const saveSeedURLs = (model,urls) => {

    return (dispatch) => {
        axios.post(env.API_URL+'/explorer-api/cmd/seed/upload/'+model, urls)
            .then(response => {
                response = {
                    type: types.UPDATE_SEED_URLS,
                    payload: urls

                }
                dispatch(response)
            })
            .catch(error => {
                throw(error);
            })
    }

};

export const modelStats = (model) => {
    return (dispatch) => {
        axios.get(env.API_URL+'/explorer-api/classify/stats/'+model)
            .then(response => {
                response = {
                    type: types.MODEL_STATS,
                    payload: response.data
                }

                dispatch(response)
            })
    }
}

let relevancy = {"page1-ann":0,"page2-ann":0,"page3-ann":0,"page4-ann":0,"page5-ann":0,"page6-ann":0,"page7-ann":0,"page8-ann":0,"page9-ann":0,"page10-ann":0,"page11-ann":0,"page12-ann":0,};
export const setRelevancy = (frame, val) => {
    return (dispatch) => {
        relevancy[frame] = val;
        console.log(relevancy);
        let response = {
            type: types.UPDATED_RELEVANCY,
            payload: relevancy
        }
        dispatch(response)
    }
}
/*
export const login = (user) => ({
    type: types.LOGIN,
    payload: user
})

export const logout = () => ({
    type: types.LOGOUT,
})*/
