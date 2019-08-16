import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cs from 'classnames'
import raf from 'raf'

import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import { CTAButton } from '../CTAButton'
import { Logo } from '../Logo'

import styles from './styles.module.css'

const isServer = (typeof window === 'undefined')

@inject('auth')
@observer
export class NavHeader extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    fixed: PropTypes.bool
  }

  static defaultProps = {
    fixed: false
  }

  state = {
    attached: (isServer || window.scrollY > 0)
  }

  componentDidMount() {
    if (!isServer) {
      window.addEventListener('scroll', this._onScroll)
      this._onScrollAF()
    }
  }

  componentWillUnmount() {
    if (!isServer) {
      window.removeEventListener('scroll', this._onScroll)
    }

    if (this._scrollRaf) {
      raf.cancel(this._scrollRaf)
      this._scrollRaf = null
    }
  }

  render() {
    const { fixed } = this.props
    const { attached } = this.state

    return (
      <header
        className={cs(styles.container, attached || fixed ? styles.attached : null)}
      >
        <div className={styles.content}>
          <div className={styles.links}>
            <Link
              to='/'
            >
              <Logo className={styles.logo} />
            </Link>

            <Link
              to='/'
              className={styles.link}
            >
              Home
            </Link>

            <Link
              to='/pricing'
              className={styles.link}
            >
              Pricing
            </Link>

            <Link
              to='/docs'
              className={styles.link}
            >
              Docs
            </Link>

            <a
              href='mailto:support@functional-income.com'
              className={styles.link}
            >
              Support
            </a>
          </div>

          {this.props.auth.isAuthenticated ? (
            <div>
              <Link to='/logout' className={styles.login}>
                <CTAButton type='secondary' inline>
                  LOGOUT
                </CTAButton>
              </Link>

              <Link to='/dashboard'>
                <CTAButton type='primary' inline>
                  DASHBOARD
                </CTAButton>
              </Link>
            </div>
          ) : (
            <div>
              <Link to='/login' className={styles.login}>
                <CTAButton type='secondary' inline>
                  LOGIN
                </CTAButton>
              </Link>

              <Link to='/signup'>
                <CTAButton type='primary' inline>
                  SIGNUP
                </CTAButton>
              </Link>
            </div>
          )}
        </div>
      </header>
    )
  }

  _onScroll = () => {
    if (!this._scrollRaf) {
      this._scrollRaf = raf(this._onScrollAF)
    }
  }

  _onScrollAF = () => {
    this._scrollRaf = null

    this.setState({
      attached: (isServer || window.scrollY > 0)
    })
  }
}
