//HAY QUE INICIAR LA PAGINA CON LIVE SERVER PARA QUE FUNCIONE LA TIENDA

const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCart = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let cart = {}

document.addEventListener('DOMContentLoaded', e => { 
    fetchData()
    if(localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
        drawCart()
    }
});

cards.addEventListener('click', e => { addCart(e) });
items.addEventListener('click', e => { btnSumRes(e) })


const fetchData = async () => {
    const res = await fetch('producto.json');
    const data = await res.json()
    drawCards(data)
}


const drawCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h4').textContent = item.title
        templateCard.querySelector('h5').textContent = item.description
        templateCard.querySelector('span').textContent = item.precio
        templateCard.querySelector('button').dataset.id = item.id
        templateCard.querySelector('img').setAttribute("src", item.thumbnailUrl)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// AÑADIR AL CARRITO
const addCart = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCart(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCart = item => {
    const producto = {
        title: item.querySelector('h4').textContent,
        precio: item.querySelector('span').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    if (cart.hasOwnProperty(producto.id)) {
        producto.cantidad = cart[producto.id].cantidad + 1
    }

    cart[producto.id] = { ...producto }
    
    drawCart()
}

const drawCart = () => {
    items.innerHTML = ''

    Object.values(cart).forEach(producto => {
        templateCart.querySelector('th').textContent = producto.id
        templateCart.querySelectorAll('td')[0].textContent = producto.title
        templateCart.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCart.querySelector('span').textContent = producto.precio * producto.cantidad
        
        
        templateCart.querySelector('.btn-info').dataset.id = producto.id
        templateCart.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('cart', JSON.stringify(cart))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(cart).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">El carrito esta vacio!</th>
        `
        return
    }
    
    // SUMAS CANT Y TOTAL
    const nCantidad = Object.values(cart).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(cart).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        cart = {}
        drawCart()
    })

}

const btnSumRes = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = cart[e.target.dataset.id]
        producto.cantidad++
        cart[e.target.dataset.id] = { ...producto }
        drawCart()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = cart[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete cart[e.target.dataset.id]
        } else {
            cart[e.target.dataset.id] = {...producto}
        }
        drawCart()
    }
    e.stopPropagation()
}

