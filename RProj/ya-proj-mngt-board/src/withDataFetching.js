import React from 'react';

export default function withDataFetching(WrappedComponent) {

  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        data: [],
        loading: true,
        error: '',
      };
    }

    async componentDidMount() {
      try {
        const tickets = await fetch(this.props.dataSource);
        const ticketsJSON = await tickets.json();

        if (ticketsJSON) {
          this.setState({
            data: ticketsJSON,
            loading: false
          });
        }
      }
      catch (err) {
        this.setState({
          data: [],
          loading: false,
          error: err.message
        });
      }
    }

    render() {
      const { data, loading, error } = this.state;

      return (
        <WrappedComponent data={data} loading={loading} error={error} {...this.props} />
      );
    }

  }
}
