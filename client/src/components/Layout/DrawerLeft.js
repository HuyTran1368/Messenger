import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStatusLeft,
  toggleStatusLeft,
} from "../../app/slices/appBarSlice";
import {
  getUserAsync,
  selectConvs,
  selectGrs,
  selectUser,
} from "../../app/slices/authSlice";
import { STRING } from "../../constants/index";
import { AuthContext } from "../../ctx/appCtx";
import Avatar from "../Avatar";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function DrawerLeft() {
  const status = useSelector(selectStatusLeft);

  const dispatch = useDispatch();

  const theme = useTheme();

  const handleDrawerClose = () => {
    dispatch(toggleStatusLeft());
  };

  const useAuth = () => {
    return useContext(AuthContext);
  };

  const auth = useAuth();

  const user = useSelector(selectUser);
  const convs = useSelector(selectConvs);
  const grs = useSelector(selectGrs);

  useEffect(() => {
    dispatch(getUserAsync(auth.user._id));
  }, [dispatch, auth.user._id]);

  console.log(user, convs, grs);

  return (
    <Drawer variant="permanent" open={status}>
      <DrawerHeader sx={{ justifyContent: "start", padding: 0 }}>
        <ListItem button key="chevron" onClick={handleDrawerClose}>
          <ListItemIcon>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </ListItemIcon>
          <ListItemText primary="Hide" />
        </ListItem>
      </DrawerHeader>
      <List>
        {convs
          ? convs.map((item, index) => {
              if (item.mems.length > 0)
                return (
                  <ListItem button key={item._id}>
                    <ListItemIcon>
                      <Avatar
                        src={"data:image/*;base64," + item.mems[0].avatar_photo}
                        alt={item.mems[0].username}
                      />
                    </ListItemIcon>
                    <ListItemText primary={item.mems[0].username} />
                  </ListItem>
                );
            })
          : STRING.EMPTY}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}