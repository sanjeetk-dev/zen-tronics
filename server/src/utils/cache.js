import NodeCache from "node-cache";

// Create an instance of NodeCache
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); 

// Function to get cache
const getCache = (key) => {
  return cache.get(key);
};

// Function to set cache
const setCache = (key, value) => {
  cache.set(key, value);
};

// Function to delete cache
const deleteCache = (key) => {
  cache.del(key);
};

// Function to flush all cache
const flushCache = () => {
  cache.flushAll();
};

export { getCache, setCache, deleteCache, flushCache };
