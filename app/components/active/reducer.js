const GET_DATA_IN_DOING = 'GET_DATA_IN_DOING';
const GET_SETDATA_IN_DOING = 'GET_SETDATA_IN_DOING';
const SET_HOTEL_NO = 'SET_HOTEL_NO';



export default (state = {}, action) => {
    switch (action.type) {
        case GET_DATA_IN_DOING:
            return {
                ...state,
                data: action.data,
            };
        case GET_SETDATA_IN_DOING:
            return {
                ...state,
                navRoot: action.data,
            };

        case SET_HOTEL_NO:
            return {
                ...state,
                hotelNo: action.data,
            };
        default:
            return state;
    }
}


export const getData = (data) => {
    return {
        type: GET_DATA_IN_DOING,
        data
    }
};

export const setData = (data, callback) => {
    callback && callback();
    return {
        type: GET_SETDATA_IN_DOING,
        data
    }
};

export const getHotelNo = (data) => {
    return {
        type: GET_HOTEL_NO,
        data
    }
};
export const setHotelNo = (data) => {
    return {
        type: SET_HOTEL_NO,
        data
    }
};
