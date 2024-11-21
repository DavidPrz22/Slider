document.addEventListener('DOMContentLoaded', ()=>{
    const prev = document.querySelector('.previous-slider');
    const next = document.querySelector('.next-slider');
    const wrapper = document.querySelector('.wrapper');
    const items_container = document.querySelector('.items-container');

    const index_imgs = document.querySelectorAll('.index_img');
    const imgs = document.querySelectorAll('.item img');
    const li_image = document.querySelectorAll('.item');
    const buttons = document.querySelector('.buttons');

    let container_dimentions = items_container.getClientRects()[0];
    let wrapper_dimentions = wrapper.getClientRects()[0];
    let elementsCount = items_container.childElementCount;

    imgs.forEach((e)=>{
        e.style.width = `${wrapper_dimentions.width}px`;
    });


    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    window.addEventListener('resize', debounce(() => {
        imgs.forEach((e)=> {
            e.style.width = `${wrapper_dimentions.width}px`;
        });
    }, 200));

    let current_img_index = 1;
    let next_position = 0;

    next.addEventListener('click',()=>{
        if (current_img_index < elementsCount) {

            next_position = (wrapper_dimentions.width)*(current_img_index);
            items_container.style.transform = `translateX(-${next_position}px)`;
            current_img_index += 1;

            updateSelectedNext();
            updateDisplayedNext();
            
        }
    });

    prev.addEventListener('click', ()=>{
        if (current_img_index > 1) {

            items_container.style.transform = `translateX(-${(next_position - wrapper_dimentions.width)}px)`;
            next_position = next_position - wrapper_dimentions.width;
            current_img_index--;

            updateDisplayedPrev();
            updateSelectedPrev();
        }
    });

    buttons.addEventListener('click', (e)=> {

        if (e.target.matches('.index_img')) {
            let value = e.target.value - 1;
            
            items_container.style.transform = `translateX(-${wrapper_dimentions.width * (value)}px)`;
            next_position = wrapper_dimentions.width * (value);
            
            current_img_index = value + 1;
            document.querySelector('.selected').classList.remove('selected');
            e.target.classList.add('selected');

            document.querySelector('.displayed').classList.remove('displayed');
            
            li_image.forEach(element => {
                if (element.value == e.target.value) element.classList.add('displayed');
            });

        }
    });

    let mousePositionX;

    wrapper.addEventListener('mousedown', (e) => {
        wrapper.classList.add('grabbing');
        e.preventDefault();

        mousePositionX = e.clientX;
        items_container.style.transition = 'transform 0ms ease';
        document.addEventListener('mousemove', updateX)


        wrapper.addEventListener('mouseup', handleMouseUp);
    });
    

    function handleMouseUp () {

        wrapper.classList.remove('grabbing');
        document.removeEventListener('mousemove', updateX);
        items_container.style.transition = 'transform 300ms ease-in';


        let prevDimentions, nextDimentions;
        const displayed = document.querySelector('.displayed');

        if (displayed.previousElementSibling) prevDimentions = displayed.previousElementSibling.getBoundingClientRect();

        if (displayed.nextElementSibling) nextDimentions = displayed.nextElementSibling.getBoundingClientRect();
        
        if (current_img_index < elementsCount && nextDimentions.left <= (wrapper_dimentions.left + (wrapper_dimentions.width*0.8))) {
            
            next_position = (wrapper_dimentions.width)*(current_img_index);
            items_container.style.transform = `translateX(-${next_position}px)`;
            current_img_index += 1;

            updateSelectedNext();
            updateDisplayedNext();
            

        } else if (current_img_index > 1 && prevDimentions.right >= (wrapper_dimentions.left + (wrapper_dimentions.width * 0.2))) {

            items_container.style.transform = `translateX(-${(next_position - wrapper_dimentions.width)}px)`;
            next_position = next_position - wrapper_dimentions.width;
            current_img_index--;

            updateDisplayedPrev();
            updateSelectedPrev();

        } else {
            items_container.style.transform = `translateX(-${next_position}px)`;
        }
        
        wrapper.removeEventListener('mouseup', handleMouseUp);
    }

    function updateX (e) {

        let moved = e.clientX - mousePositionX;
        
        if (current_img_index <= 1 && (moved > 0) || current_img_index >= elementsCount && (moved < 0)) return;

        items_container.style.transform = `translateX(-${next_position - moved}px)`;
        
    }

    function updateSelectedPrev(){
        index_imgs.forEach((e)=>{
            if (e.matches('.selected') && e.previousElementSibling) {
                
                e.classList.remove('selected');
                e.previousElementSibling.classList.add('selected');
            }
        });
    }

    function updateSelectedNext(){
        for (let i = 0; i < index_imgs.length; i++) {
                
            if (index_imgs[i].matches('.selected') && index_imgs[i].nextElementSibling) {

                index_imgs[i].classList.remove('selected');
                index_imgs[i].nextElementSibling.classList.add('selected');
                break;
            }
        }
    }

    function updateDisplayedNext() {
        for (let i = 0; i < li_image.length; i++) {

            if (li_image[i].matches('.displayed') && li_image[i].nextElementSibling) {

                li_image[i].classList.remove('displayed');
                li_image[i].nextElementSibling.classList.add('displayed');
                break
            }
        }
    }

    function updateDisplayedPrev() {
        li_image.forEach((e)=> {
            if (e.matches('.displayed') && e.previousElementSibling) {

                e.classList.remove('displayed');
                e.previousElementSibling.classList.add('displayed');
            }
        });
    }
});