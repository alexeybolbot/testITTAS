$(() => {
    const grid = jQuery("#list");

    grid.jqGrid({
        url: "phonebook",
        datatype: "json",
        mtype: "GET",
        height: 250,
        width: 600,
        colNames: ["ФИО", "Страна", "Город", "Телефон"],
        colModel: [
            { name: "fio", width: 150, editable: true},
            { name : 'country', width:100, align:'center', editable:true, edittype: 'select', formatter: 'select',
                editoptions:{
                    value: countries,
                    dataEvents: [
                        {
                            type: 'change',
                            fn: (e) => { changeCitySelect($(e.target).val()); }
                        }
                    ]
                }
            },
            { name: "city", width: 100, align: "right", editable: true, edittype: 'select', formatter: 'select',
                editoptions:{
                    value: allCities,
                    dataInit: () => {
                        setTimeout(() => { initCitySelect($("select#country").val(), $("select#city").val()); });
                    }
                }
            },
            { name: "phone_number", width: 100, align: "right", sortable: false, editable: true }
        ],
        pager: "#pager",
        rowNum: 10,
        rowList: [10, 5, 1],
        loadonce: true,
        viewrecords: true,
        gridview: true,
        autoencode: true,
        caption: "Телефонный справочник",
    }).navGrid('#pager', { edit: true, add: true, del: true, search: true, refresh: true },
        {
            url: "phonebook/update",
            closeAfterEdit: true,
            afterComplete: response => {
                $("#list").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
                alert(response.responseText);
            }
        },
        {
            url: "phonebook/add",
            recreateForm:true,
            closeAfterAdd: true,
            afterComplete: response => {
                $("#list").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
                alert(response.responseText);
            }
        },
        {
            url: "phonebook/delete",
            closeAfterDelete: true,
            afterComplete: response => {
                $("#list").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
                alert(response.responseText);
            }
        },{
            multipleSearch:true
        });
});

const countries = { 'Беларусь': 'Беларусь', 'Польша': 'Польша', 'Россия': 'Россия', 'Украина': 'Украина' };
const citiesOfRB = { 'Брест': 'Брест', 'Витебск': 'Витебск', 'Гомель': 'Гомель', 'Гродно': 'Гродно', 'Минск': 'Минск',
    'Могилёв': 'Могилёв' };
const citiesOfPL = { 'Варшава': 'Варшава', 'Краков': 'Краков', 'Лодзь': 'Лодзь', 'Вроцлав': 'Вроцлав' };
const citiesOfRU = { 'Москва': 'Москва', 'Санкт-Петербург': 'Санкт-Петербург', 'Новосибирск': 'Новосибирск' };
const citiesOfUA = { 'Киев': 'Киев', 'Харьков': 'Харьков', 'Одесса': 'Одесса', 'Днепр': 'Днепр', 'Донецк': 'Донецк' };

const allCities = Object.assign({}, citiesOfRB, citiesOfPL, citiesOfRU, citiesOfUA);

let cities, output = [];
arrayOfCities = {'Беларусь': citiesOfRB, 'Польша': citiesOfPL, 'Россия': citiesOfRU, 'Украина': citiesOfUA};

const changeCitySelect = countryId => {
    $("#city").empty();
    output = [];
    cities = arrayOfCities[countryId];

    $.each(cities, (key, value) => {
        output.push('<option value="'+ key +'">'+ value +'</option>');
    });

    $('#city').html(output.join(''));
};

const initCitySelect = (countryId, cityId) => {
    changeCitySelect(countryId);
    $(`#city [value=${cityId}]`).attr("selected", "selected");
};