import React from 'react'
import ErrorBoundary from './ErrorBoundary'
import Layout  from './Layout'

export default function Wrapper({ children }) {
  return (
    <ErrorBoundary>
      <Layout>
          {children} 
      </Layout> 
    </ErrorBoundary>
  )
}
