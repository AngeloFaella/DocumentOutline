

let DocumentOutline;

(function()
{
    const menuSvg = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='transform:;-ms-filter:'><path d='M4 11H16V13H4zM4 6H20V8H4zM4 18L11 18 11.235 18 11.235 16 11 16 4 16z'></path></svg>";
    const closeSvg = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' stroke='var(--outline-primary-color)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-minimize-2'><polyline points='4 14 10 14 10 20'></polyline><polyline points='20 10 14 10 14 4'></polyline><line x1='14' y1='10' x2='21' y2='3'></line><line x1='3' y1='21' x2='10' y2='14'></line></svg>";
    const cancelSvg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' aria-labelledby='title' aria-describedby='desc' role='img' xmlns:xlink='http://www.w3.org/1999/xlink'> <path data-name='layer1'fill='var(--outline-text-color-light)' d='M51 17.25L46.75 13 32 27.75 17.25 13 13 17.25 27.75 32 13 46.75 17.25 51 32 36.25 46.75 51 51 46.75 36.25 32 51 17.25z'></path></svg>";

    
    DocumentOutline = class DocumentOutline {

        /**
         * @class DocumentOutline
         * @param {Object} options 
         * @param {String} [options.backgroundColor] background color of the outline
         * @param {String} [options.textColor] text color of the first-level sections
         * @param {String} [options.accentColor] accent color of the outline
         * @param {String} [options.textColorLight] text color of the sub sections
         * @param {String} [options.defaultOpen] indicate the initial mode of the outline. Outline is open by default on desktop and closed on mobile.
         */
        constructor({backgroundColor, textColor, textColorLight, accentColor, defaultOpen}={}){
            this._headingMap = [];
            this._parentList = [];
            this._isMobile = window.innerWidth < 780; // mobile & tablet
            this._open = !this._isMobile;

            // set :root variables
            let root = document.documentElement;
            if(backgroundColor){
                root.style.setProperty('--outline-bg-color', backgroundColor);
            }
            if(textColor){
                root.style.setProperty('--outline-text-color', textColor);
            }
            if(accentColor){
                root.style.setProperty('--outline-primary-color', accentColor);
            }
            if(textColorLight){
                root.style.setProperty('--outline-text-color-light', textColorLight);
            }
            if(defaultOpen != undefined){
                this._open = defaultOpen;
            }

            // get heading tags
            const headingList = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
            headingList.forEach(tag => {
                this._headingMap.push({
                    tag,
                    level: Number(tag.tagName[1])
                })
            });

            this._buildOutline();
            this._renderOutline();
        }

        _getParent = level =>{
            for(let i=0; i < this._parentList.length; i++){
                let node = this._parentList[i];
        
                if(node.level < level)
                    return node;
                
                if(node.level === level && node.elem.tagName == 'UL')
                    return node
            }
        }

        _hasSibilings = level => {
            const parent = this._getParent(level);
            const family = this._parentList.slice(0, this._parentList.indexOf(parent)+1);

            for(let i=0; i < family.length; i++){
                let node = family[i];
        
                if(node.level === level)
                    return true;
            }
            return false;
        }

        _buildOutline = () => {
            this._parentList = [{
                elem: document.createElement('ul'),
                level: 0
            }];
            
            for(let i=0; i < this._headingMap.length; i++){
                const level = this._headingMap[i].level;
                const parent = this._getParent(level)
                
                let li = document.createElement('li');
                let span = document.createElement('span');
                let div = document.createElement('div');
                
                // add navigation
                span.innerHTML = this._headingMap[i].tag.innerHTML;    
                span.addEventListener('click', e => {
                    window.scrollTo(0, this._headingMap[i].tag.offsetTop);
                    if(this._isMobile) this.hideOutline();
                    document.getElementsByClassName('outline-search')[0].value = '';
                    this.onSearchInput('')  
                })
                
                // build dom
                div.setAttribute('class','li-content li-title-'+level);
                div.appendChild(span);
                li.appendChild(div);
            
                let node = { elem: li, level};
                if(parent.elem.tagName == 'LI' || !this._hasSibilings(level)){
                    let ul = document.createElement('ul');
                    ul.appendChild(li);
                    node.elem = ul;
                }
                
                // attach to parent
                let container = parent.elem;
                if(parent.elem.tagName == 'UL' 
                    && parent.elem?.childNodes[0]?.tagName == 'LI'
                    && !this._hasSibilings(level)){
                    container = parent.elem.firstChild;
                }

                // attach to list
                container.setAttribute('class','list-head');
                container.appendChild(node.elem);        
                this._parentList.unshift(node);
            }
            
            // save list root
            this._root = this._parentList[this._parentList.length-1].elem;  
            this._root.setAttribute('id','outline-list-root');      
        }
        
        _renderOutline = () => {             
            this._nav = document.createElement('nav');
            this._main = document.createElement('div');

            // menu icon
            this._menuIcon = document.createElement('div');
            this._menuIcon.classList = 'outline-menu-icon-container';
            this._menuMobile = document.createElement('div');
            this._menuMobile.classList.add('outline-mobile-menu-icon-container');

            // serachbar
            this._searchbar = document.createElement('input');
            this._searchbar.classList = 'outline-search';  
            this._searchbar.setAttribute('type','text');  
            this._searchbar.setAttribute('placeholder','Search...')
            this._searchbar.addEventListener('keyup', e => this.onSearchInput(e.target.value));
            
            // searchbar container
            this._searchbarContainer = document.createElement('div');
            this._noResults = document.createElement('p');
            this._noResults.innerHTML = 'No results found.';
            this._searchbarContainer.classList.add('outline-search-container');
            this._searchbarContainer.appendChild(this._searchbar);
            this._searchbarContainer.appendChild(this._noResults);

            // header
            this._navHeader = document.createElement('div');
            this._navHeader.classList = 'outline-nav-header';
            this._navHeader.appendChild(this._searchbarContainer);
            this._navHeader.appendChild(this._menuIcon);

            // outline
            this._nav.appendChild(this._navHeader);
            this._nav.classList = 'outline-nav';
            if(!this._open)
                this.hideOutline();

            // add to DOM 
            document.body.removeChild(document.body.childNodes[0]);
            this._main.setAttribute('id','main-document');
            this._nav.appendChild(this._root);
            document.body.appendChild(this._main);
            this._main.appendChild(document.body.childNodes[0])
            document.body.appendChild(this._nav);

            if(this._isMobile || !this._open){
                this._main.appendChild(this._menuMobile);
                this._addIconSvg(this._menuMobile, 'menu');
            }else
                this._addIconSvg(this._menuIcon, 'close');

            this._menuIcon.addEventListener('click', e => {
                if(this._open) this.hideOutline()
                else this.showOutline();
                this._open = !this._open;
            });
            
            this._menuMobile.addEventListener('click', e => {
                this.showOutline()
                this._open = true;
                this._menuMobile.style.display = 'none';
            });
        }
        
        _addIconSvg = (container, icon) => {
            let html = icon === 'menu' ? menuSvg : closeSvg;
            container.innerHTML = html;
            
            if(this._isMobile){
                let svg = document.querySelector('.outline-mobile-menu-icon-container svg');
                if(svg) svg.classList.add('outline-mobile-menu-icon');
            }
        }

        /**
         * @function onSearchInput 
         * @description Called when a search is submitted
         * @param {String} text text to search
         */
        onSearchInput = text => {
            let filter = text.toLowerCase();
            let spans = document.querySelectorAll('.li-content > span');
            let divs = document.querySelectorAll('.li-content');

            let resultsFound = false;
            for (let i = 0; i < spans.length; i++) {
                let txtValue = spans[i].innerText || spans[i].innerHTML;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                  divs[i].style.display = "";
                  resultsFound = true;
                } else {
                  divs[i].style.display = "none";
                }
            }

            if(!resultsFound) 
                this._noResults.style.display = 'block';
            else
                this._noResults.style.display = 'none';

        };

        /**
         * @function showOutline
         * @description Show document outline.
         * On **desktop** the outline is placed aside the main content takes 20% of the width.
         * On **mobile** the outline is placed above the main content and takes 100% of the width.
         */
        showOutline = () => {
            this._menuIcon.style.visibility = 'hidden';
            this._menuIcon.classList.remove('outline-menu-container-collapsed');

            this._navHeader.classList.remove('outline-nav-header-collapsed');
            this._main.classList.remove('no-outline');
            
            this._nav.classList.remove('outline-nav-collapsed')
            if(this._isMobile) document.body.style.overflow = 'hidden';
            
            this._root.style.display = 'block';
            this._root.style.visibility = 'visible';

            setTimeout(() =>{
                this._root.style.opacity = 1
                this._nav.style.overflowY = 'visible';
                this._menuIcon.style.visibility = 'visible';
                this._addIconSvg(this._menuIcon, 'close');
                this._searchbar.style.display = 'block';
            }, 400);
        }

        /**
         * @function hideOutline
         * @description Hide document outline.
         * On **desktop** the outline reduces its width to 3%.
         * On **mobile** the outline disappears completly and a floating button appears in the bottom-left corner.
         */
        hideOutline = () => {
            this._searchbar.style.display = 'none';
            this._menuIcon.style.visibility = 'hidden';
            this._addIconSvg(this._menuIcon, 'menu');
            this._navHeader.classList.add('outline-nav-header-collapsed');

            this._nav.style.overflowY = 'hidden';
            this._nav.classList.add('outline-nav-collapsed');
            this._main.classList.add('no-outline');

            if(this._isMobile) document.body.style.overflow = 'auto';
            this._root.style.visibility = 'hidden';
            this._root.style.opacity = 0;
            
            setTimeout(() => {
                this._root.style.display = 'none';
                this._menuIcon.classList.add('outline-menu-container-collapsed');
                this._menuIcon.style.visibility = 'visible';
                
                if(this._isMobile)
                    this._menuMobile.style.display = 'block';
            }, 350)
            
        }
    }
})();