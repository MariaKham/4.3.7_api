const mainContent = document.querySelector('.main');
// форма и инпут
const searchForm = document.createElement('form');
const inputForm = document.createElement('input');
searchForm.classList.add('search-form');
inputForm.classList.add('search-input');
// выпадающий список репо
const repoList = document.createElement('ul');
repoList.classList.add('repo-list');
// контейнер для выбранных репо
const repoWrap = document.createElement('div');
repoWrap.classList.add('repo-wrapper')
// добавляем на стр
mainContent.append(searchForm);
searchForm.append(inputForm);
mainContent.append(repoList);
mainContent.append(repoWrap);

//пре список репо
function showRepoList(repoData) {
    for (let i = 0; i < 5; i++) {
        let name = repoData.items[i].name;
        let owner = repoData.items[i].owner.login;
        let stars = repoData.items[i].stargazers_count;

        const repoPrew = document.createElement('li');
        repoPrew.classList.add('repo-prew');
        repoPrew.insertAdjacentHTML('beforeend', `<li class="repo-prew" data-owner="${owner}" data-stars="${stars}">${name}</li>`);
        repoList.append(repoPrew);
    }
}

//карточка репо с данными из API
function selectedRepo(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;

    repoWrap.insertAdjacentHTML('beforeend', `<div class="repo">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="delete-button">X</button></div>`);
}

//добавление карточки репо на стр
repoList.addEventListener('click', function (e) {
    let target = e.target;
    target.classList.toggle('repo-prew');
    selectedRepo(target);
    inputForm.value = '';
    clearRepositories();
});

//удаление карточки репо со стр
repoWrap.addEventListener('click', function (e) {
    let target = e.target;
    if (!target.classList.contains('delete-button')) return;
    e.target.parentNode.remove();
});


//очищение поиска после селекта
function clearRepositories() {
    repoList.innerHTML = '';
}

// fetch запрос данных
async function searchRepositories() {
    const searchValue = inputForm.value;
    if (searchValue == '') {
        clearRepositories();
        return;
    }
    try {
        let response = await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`);
        if (response.ok) {
            let repo = await response.json();
            showRepoList(repo);
        } else {
            return null
        };
    } catch (err) {
        console.log('Error: ' + err);
    }
}

// вспомогательная ф-я задержки отправки запроса
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

inputForm.addEventListener('keyup', debounce(searchRepositories.bind(this), 500));











