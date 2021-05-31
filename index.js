
(function pieChart() {   

    const svgNS = "http://www.w3.org/2000/svg",
        url = 'http://localhost:5501/data.json',
        svg = document.querySelector('.svg');
        keyList = document.querySelector('.key-list'),
        r = 15.9155,
        cx = "18",
        cy = "18",
        col = () => ~~(Math.random() * 255) + 1,
        newData = [];

       

    const configData = data => {
        newData = data.map((el, idx, arr) => { 
            return { 
                ...el,
                share: +el.share,
                color: el.color ? el.color : `rgba(${col()}, ${col()}, ${col()}, 0.3)`,
                offSet: Object.values(arr)
                    .map(el => +el.share)
                    .map((_, i, arr2) => 
                        arr2.slice(0, i)
                        .reduce((acc, cur) => acc + cur, 0)
                    )[idx]
            }             
        });
    };

    const addEmptySpace = () => {
        const totalUsed = Object.values(newData)
            .map(el => el.share)
            .reduce((acc, cur) => acc + cur, 0);
        if(totalUsed < 100){   
            const freeSpace = {
                id: newData.length + 1,
                title: 'free space',
                share: 100 - totalUsed,
                color: '#fafafa',
                offSet: totalUsed
            }
            newData = [ ...newData, freeSpace ];
        } 
    }


    const createCircle = el => {   
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("stroke", el.color);
        circle.setAttribute("stroke-dasharray", `${el.share} ${100 - el.share}`);
        circle.setAttribute("stroke-dashoffset", 100 - el.offSet);
        svg.appendChild(circle);
       
    };

    const createKeyEntry = el => { 
        const listItem = `         
            <li key=${el.title}> 
                <span class="icons" style="background-color: ${el.color}"> </span> 
                <span class="item"> 
                    ${el.title} 
                </span> 
                <span class="percent">
                    ${el.share}%
                </span>
            </li>
        `;
        keyList.insertAdjacentHTML('beforeend', listItem);   
    }

    (async function init(){  
        try {
            const res = await fetch(url);
            if(!res.ok) throw new Error(`Problem loading data: ${res.status}`) 
            const data = await res.json();
            configData(data);    
            addEmptySpace(); 
            newData.map(el => {
                createCircle(el);
                createKeyEntry(el);
            });
        } catch(err){
            console.error(err.message);
        }
    })();

})();
