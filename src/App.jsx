import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function App() {
  const [tempProducts, setTempProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cartProducts, setCartProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflow: 'auto',
    maxHeight: '70%',
  };

  useEffect(() => {
    async function fetchProducts() {
      const call = await fetch(`https://reactapi.pautinaweb.ru/objects.php`);
      const response = await call.json();
      setProducts(response);
      setTempProducts(response);
    }
    fetchProducts();
  }, []);

  function sort(type = 'asc') {
    setTempProducts([...tempProducts.sort((a, b) => type === 'asc' ? a.price - b.price : type === 'desc' ? b.price - a.price : '')]);
  }

  useEffect(() => {
    setTempProducts([...products.filter((item) => item.name.toLowerCase().includes(search))])
  }, [search]) 

function addToCart(item) {
  console.log(item)
  let product  = cartProducts.find((product) => product.id == item.id);
  if(product) {
    if (product.sklad < 0 || product.quantity >= item.sklad) {
      return;
    }
    const tempCartProducts = [...cartProducts];
    tempCartProducts[tempCartProducts.indexOf(product)].quantity += 1;
    setCartProducts([...tempCartProducts]);
    console.log(cartProducts);
    return;
  }
  const tempItem = item;
  tempItem.quantity = 1;
  setCartProducts(cartProducts => [...cartProducts, tempItem]);
  console.log(cartProducts);
}
function removeFromCart(item) {
  let product  = cartProducts.find((product) => product.id == item.id);
  if(product) {
    const tempCartProducts = [...cartProducts];
    delete tempCartProducts[tempCartProducts.indexOf(product)];
    setCartProducts([...tempCartProducts]);
  }
  return;
}
  
  return (
    <>
    <article className="main">
      <header>
        <div className="logo">
          <p>SAFQ</p>
        </div>
        <div className="nav">
          <div className="cart">
            <img src="./public/cart.png" alt="" />
          </div>
        </div>
      </header>
      <main>
      <section className='px-5 container mx-auto pt-10'>
      <Typography variant="h2" component="h2" className="Title">
        Продукты
        <div className="Search">
        <div className='flex items-center justify-between gap-1'>
          <div className='flex items-center gap-1'>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} />
          <SearchIcon />
          </div>
          <div className='flex gap-2'>
            <Button variant="outlined" onClick={() => sort('desc')}>
              По убыванию
            </Button>
            <Button variant="outlined" onClick={() => sort()}>
              По возрастанию
            </Button>
          </div>
        </div>
      </div>
      </Typography>

        <div className="Products">
        {tempProducts.map((item) => {
          return (
            <article className=' p-3 rounded-2xl bg-white '  key={item.id}>
              <h2 className='text-xl font-bold'>{item.name} </h2>
              <p className='mt-2 text-sm'>{item.description}</p>
              <p className='mt-8 font-semibold text-[var(--text-color)]'>{item.price} руб.</p>
              <p>{item.sclad} шт.</p>
            </article>
          )
        })}
        </div>
    </section>
      </main>
      <footer>
      <div className="logo">
          <p>SAFQ</p>
        </div>
        <div className="nav">
          <div className="cart">
            <img src="./public/cart.png" alt="" />
          </div>
        </div>
      </footer>
    </article>
    </>
  )
}

export default App
