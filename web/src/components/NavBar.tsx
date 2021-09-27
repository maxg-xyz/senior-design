import { AddIcon, CloseIcon, HamburgerIcon, LockIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Link,
  Avatar,
  Button,
  Menu,
  Image,
  MenuButton,
  MenuDivider,
  MenuItem,
  useColorModeValue,
  MenuList,
  IconButton,
  useDisclosure,
  HStack,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import NextLink from "next/link";
import {
  IoArchiveOutline,
  IoBagHandleOutline,
  IoLogOutOutline,
  IoMoonOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { useRouter } from "next/router";
import { UserSettingsModal } from "./user/UserSettingsModal";
import { useApolloClient } from "@apollo/client";

interface NavBarProps {}

const Links = ["About", "Contact", "Shop"];

const NavLink = ({ children }: { children: ReactNode }) => (
  <NextLink href={`/${children.toString().toLowerCase()}`}>
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.800"),
      }}
    >
      {children}
    </Link>
  </NextLink>
);

const Logo = (props: any) => {
  return (
    <NextLink href={"/"}>
      <Link
        rounded={"md"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Image
          h="8"
          src="https://swipet.s3.us-east-2.amazonaws.com/swipet-logo-white.png"
        />
      </Link>
    </NextLink>
  );
};

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  let userBody = null;

  // data is loading
  if (loading) {
    // user not logged in
  } else if (!data?.me) {
    userBody = (
      <Flex alignItems={"center"}>
        <NextLink href="/login">
          <Button
            variant={"ghost"}
            colorScheme={"grey"}
            size={"sm"}
            mr={4}
            leftIcon={<LockIcon />}
            _hover={{
              bg: "blue.200",
              colorScheme: "white",
            }}
          >
            Sign in
          </Button>
        </NextLink>

        <NextLink href="/register">
          <Button
            fontWeight={600}
            _hover={{
              bg: "blue.200",
            }}
            variant={"solid"}
            colorScheme={"blue"}
            size={"sm"}
            mr={4}
            leftIcon={<AddIcon />}
          >
            Sign up
          </Button>
        </NextLink>
      </Flex>
    );
    // user is logged in
  } else {
    userBody = (
      <Flex alignItems={"center"}>
        <NextLink href={"/members/shop"}>
          <Button
            variant={"solid"}
            colorScheme={"yellow"}
            size={"sm"}
            mr={4}
            leftIcon={<IoBagHandleOutline size={"1.25em"} />}
          >
            Team Shop
          </Button>
        </NextLink>

        <Menu>
          <MenuButton
            as={Button}
            rounded={"full"}
            variant={"link"}
            cursor={"pointer"}
          >
            <Avatar
              name={data.me.firstname + " " + data.me.lastname}
              size={"sm"}
              src={data.me.avatarUrl}
            />
          </MenuButton>
          <MenuList>
            <Flex pl={"3.5"} justifyContent={"flex-start"}>
              Hey, {data.me.firstname}!
            </Flex>
            <MenuDivider />

            <MenuItem justifyContent={"space-between"}>
              <NextLink href={"/orders"}>Order History</NextLink>
              <IoArchiveOutline size={"1.25em"} />
            </MenuItem>
            <UserSettingsModal />
            <MenuItem
              justifyContent={"space-between"}
              onClick={toggleColorMode}
              size={"sm"}
            >
              <p>Toggle Color Mode</p>
              {colorMode === "light" ? (
                <IoMoonOutline size={"1.25em"} />
              ) : (
                <IoSunnyOutline size={"1.25em"} />
              )}
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={async () => {
                await logout();
                await apolloClient.resetStore();
                router.push("/");
              }}
              isLoading={logoutFetching}
              variant="link"
              justifyContent={"space-between"}
            >
              Logout
              <IoLogOutOutline size={"1.25em"} />
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  return (
    <Box
      bg={"rbga(0, 0, 0, 0.0)"}
      px={8}
      zIndex={99}
      position="sticky"
      top={0}
      /* boxShadow={"lg"} */
      bgGradient="linear(to-b, gray.700, rgba(0,0,0,0))"
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />

        <HStack spacing={8} alignItems={"center"}>
          <Box>
            <Logo />
          </Box>

          <HStack
            as={"nav"}
            spacing={4}
            fontWeight="normal"
            display={{ base: "none", md: "flex" }}
            color="white"
          >
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>

        <Flex display={{ base: "none", md: "flex" }}>{userBody}</Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
            <Flex justifyContent={"flex-end"}>{userBody}</Flex>
          </Stack>
        </Box>
      ) : null}
    </Box>
  ); //
};
