import { Box } from '@mantine/core';
import {
  DefaultProps,
  getDefaultZIndex,
  MantineNumberSize,
  MantineStyleSystemSize,
  Selectors,
  useComponentDefaultProps,
} from '@mantine/styles';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';

import { AppShellProvider } from './AppShell.context';
import useStyles from './AppShell.styles';

export type AppShellStylesNames = Selectors<typeof useStyles>;

export interface AppShellProps
  extends Omit<
    DefaultProps<AppShellStylesNames>,
    MantineStyleSystemSize
  > {
  /** <Navbar /> component */
  navbar?: React.ReactElement;

  /** <Aside /> component */
  aside?: React.ReactElement;

  /** <Header /> component */
  header?: React.ReactElement;

  /** <Footer /> component */
  footer?: React.ReactElement;

  /** zIndex prop passed to Navbar and Header components */
  zIndex?: React.CSSProperties["zIndex"];

  /** true to switch from static layout to fixed */
  fixed?: boolean;

  /** true to hide all AppShell parts and render only children */
  hidden?: boolean;

  /** AppShell content */
  children: React.ReactNode;

  /** Content padding */
  padding?: MantineNumberSize;

  /** Breakpoint at which Navbar component should no longer be offset with padding-left, applicable only for fixed position */
  navbarOffsetBreakpoint?: MantineNumberSize;

  /** Breakpoint at which Aside component should no longer be offset with padding-right, applicable only for fixed position */
  asideOffsetBreakpoint?: MantineNumberSize;
}

const defaultProps: Partial<AppShellProps> = {
  fixed: true,
  zIndex: getDefaultZIndex("app"),
  padding: "md",
};

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  function AppShell(props: AppShellProps, ref) {
    const router = useRouter();

    const {
      children,
      navbar,
      header,
      footer,
      aside,
      fixed,
      zIndex,
      padding,
      navbarOffsetBreakpoint,
      asideOffsetBreakpoint,
      className,
      styles,
      classNames,
      unstyled,
      hidden,
      ...others
    } = useComponentDefaultProps("AppShell", defaultProps, props);
    
    const { classes, cx } = useStyles(
      { padding, fixed, navbarOffsetBreakpoint, asideOffsetBreakpoint },
      { styles, classNames, unstyled, name: "AppShell" }
    );

    if (hidden) {
      return <>{children}</>;
    }

    return (
      <AppShellProvider value={{ fixed, zIndex }}>
        <Box className={cx(classes.root, className)} ref={ref} {...others}>
          {header}
          <div className={classes.body}>
            {navbar}
            <AnimatePresence exitBeforeEnter>
              <motion.main
                className={classes.main}
                key={router.route}
                initial="initialState"
                animate="animateState"
                exit="exitState"
                transition={{
                  duration: 0.40,
                }}
                variants={{
                  initialState: {
                    opacity: 0,
                    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                  },
                  animateState: {
                    opacity: 1,
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  },
                  exitState: {
                    opacity: 0,
                    clipPath: "polygon(0 0, 100% 0, 100% 10%, 0 10%)",
                  },
                }}
              >
                {children}
              </motion.main>
            </AnimatePresence>
            {aside}
          </div>
          {footer}
        </Box>
      </AppShellProvider>
    );
  }
);
