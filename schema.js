const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

const CustomerType = new GraphQLObjectType({
  name: 'customer',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

// ROOT QUERY
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parent, args) {
        return axios
          .get('http://localhost:3000/customers')
          .then(res => res.data);
      }
    },
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(`http://localhost:3000/customers/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

// MUTATION FOR ADDING, DELETING CUSTOMERS
const mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return axios
          .post('http://localhost:3000/customers', args)
          .then(res => res.data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return axios
          .delete(`http://localhost:3000/customers/${args.id}`)
          .then(res => res.data);
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return axios
          .patch(`http://localhost:3000/customers/${args.id}`, args)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
