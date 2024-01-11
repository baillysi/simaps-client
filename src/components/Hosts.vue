<template>
    <div class="container">
      <div class="row">
        <div class="col-sm-10">
          <h1>Hosts</h1>
          <hr><br><br>
          <button type="button" class="btn btn-success btn-sm">Add Host</button>
          <br><br>
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Zone</th>
                <th scope="col">Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(host, index) in hosts" :key="index">
                <td>{{ host.name }}</td>
                <td>{{ host.zone }}</td>
                <td>{{ host.price }}</td>
                <!-- <td>
                  <span v-if="book.read">Yes</span>
                  <span v-else>No</span>
                </td> -->
                <td>
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-warning btn-sm">Update</button>
                    <button type="button" class="btn btn-danger btn-sm">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        hosts: [],
      };
    },
    methods: {
        getHosts() {
        const path = 'http://localhost:5001/hosts';
        axios.get(path)
          .then((res) => {
            this.hosts = res.data;
            console.log(this.hosts)
          })
          .catch((error) => {
            console.error(error);
          });
      },
    },
    created() {
      this.getHosts();
    },
  };
  </script>