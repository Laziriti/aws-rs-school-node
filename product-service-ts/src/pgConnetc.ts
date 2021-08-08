const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export default {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
}

// QUERY TO CREATE TABLES FOR DB (need to store it in git repo)
// create table products (
//     id uuid primary key default uuid_generate_v4(),
//     title text,
//     description text,
//     price integer
//     )
    
//     drop table todo_list 
    
//     create table stocks (
//     id uuid primary key  default uuid_generate_v4(),
//     product_id uuid,
//     count integer,
//     foreign key ("product_id") references "products" ("id")
//     )
    
    
//     insert into products (title, description,price) values
//     ('Product1', 'Super product1', '100'),
//     ('Product2', 'Super product2', '200'),
//     ('Product3', 'Super product3', '300'),
//     ('Product4', 'Super product4', '400'),
//     ('Product5', 'Super product5', '500'),
//     ('Product6', 'Super product6', '600'),
//     ('Product7', 'Super product7', '700')
    
//     insert into stocks (product_id, count) values
//     ('e4195f0b-fd61-4807-863e-e622ee7db395', 1),
//     ('16447bd0-a7ee-4fe6-8c83-fcb51d920e8b', 2),
//     ('9c13917e-6f71-4f6d-a107-3d0e2dcbf804', 1),
//     ('c28644d3-cd51-496e-9dbb-9636374017d8', 2),
//     ('ad22825a-fd23-46dd-b9d3-7a26e38af09f', 1),
//     ('66262b05-e1ad-46fc-9447-97086ef41c8b', 2),
//     ('9657c18d-a2ff-4990-846a-5b579d478fd5', 2)
    