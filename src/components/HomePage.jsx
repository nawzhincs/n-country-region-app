import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Image, background } from "@chakra-ui/react";
import { Box, HStack } from "@chakra-ui/layout";
import {
  Button,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  SimpleGrid,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { BsChevronDown } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import DataTable from "datatables.net-dt";
import { act } from "react-dom/test-utils";
import ReactPaginate from "react-paginate";
import Highlighter from "react-highlight-words";

const chunkIntoN = (arr, n) => {
  const size = Math.ceil(arr.length / n);  
  return Array.from({ length: n }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
};


const HomePage = () => {
  //state
  const [menuItem, setMenuItem] = useState("all");

  const [searchInput, setSearchInput] = useState("");

  const [error, setErrors] = useState();

  const [data, setData] = useState([]);
  
  const [searchData, setSearchData] = useState([]);

  // pagination states
  const [index, setIndex] = useState(0);

  const [page , setPage]= useState(0);

  const [activePage , setActivePage] = useState(0);

  // data
  const filterRegion = [
    "all",
    "Africa",
    "Americas",
    "Asia",
    "Europe",
    "Oceania",
  ];

  let navigate = useNavigate();


  const handleMenuItem = (value) => {

    setMenuItem(value);
  };

  const handleActivePage = (activePage) => {
 
    // setIndex(activePage)
  };


  const handleSearchInput = (e) => {
    e.preventDefault();


    setSearchInput(e.target.value);

    console.log(searchInput);



   let searchResultData =  searchData.filter((element) =>
        element.name.common.toLowerCase().includes(e.target.value.toLowerCase())
      )


      console.log(  "result search data is ", searchResultData)
      setPage(Math.ceil(searchResultData / 8))

    setData(
      // searchResultData
      chunkIntoN(searchResultData , searchResultData.length  / 8)
    );


    searchResultData=[];





  };

  useEffect(() => {
    if (menuItem === "all") {
        

      axios
        .get(`https://restcountries.com/v3.1/all`)
        .then((response) => {
        
        
          setPage(Math.ceil(response.data.length / 8) )
         
          setData(chunkIntoN(response.data , response.data.length / 8))

            setSearchData(response.data);



        })
        .catch((error) => {
          console.log(error.message);
          setErrors(error.message);
        });


    } else {
      axios
        .get(`https://restcountries.com/v3.1/region/${menuItem}`)
        .then((response) => {
          setPage(Math.ceil(response.data.length / 8) )

          setData(chunkIntoN(response.data , response.data.length / 8))

            setSearchData(response.data);


        })
        .catch((error) => {
          console.log( "Error is" , error.message);
          setErrors(error.message);
        });
    }
  }, [menuItem]);

  if (error)
    return (
      <span
        style={{
          color: "orange",
          fontSize: "25px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Error in server {error}
      </span>
    );

  return (
    <div>
      <NavBar />
      <Box p={10}>
        <HStack flexWrap={"wrap"} justifyContent={"space-between"}>
          <Box boxShadow={"sm"}>
            <InputGroup w={"300px"}>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                value={searchInput}
                onChange={handleSearchInput}
                focusBorderColor="gray.400"
                type="text"
                placeholder="Search for a country "
              />
            </InputGroup>
          </Box>

          <Menu>
            <MenuButton
              fontWeight={"400"}
              marginY={2}
              as={Button}
              rightIcon={<BsChevronDown />}
            >
              {" "}
              {menuItem === "all" ? (
                <span>Filter By Regions</span>
              ) : (
                <span>{menuItem}</span>
              )}{" "}
            </MenuButton>
            <MenuList>
              {filterRegion.map((element) => (
                <MenuItem
                  key={element}
                  onClick={() => {
                    handleMenuItem(element);
                  }}
                >
                  {element}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      {data.length === 0 ? (
        <Progress colorScheme="blue" size="xs" isIndeterminate />
      ) : (
        <Box w="100%">
          <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
            spacing={10}
            pr="50"
            pl="50"
          >
            { data && data[index].map((element, index) => (
              <GridItem
                key={element?.cca2?.toLowerCase()}
                onClick={() =>
                  navigate(`/singlecountry/${element?.cca2?.toLowerCase()}`, {})
                }
              >
                <Box
                  margin={"0 auto"}
                  maxW="sm"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow={"md"}
                  transition={"transform .2s"}
                >
                  <Image
                    src={element.flags.svg}
                    alt={element.name.common}
                    height="200px"
                    width="100%"
                  />
                  <Box p="6">
                    <Box
                      mt="1"
                      fontWeight="semibold"
                      as="h4"
                      lineHeight="tight"
                      noOfLines={1}
                    >
                     
                     {searchInput===''? (<p>{element.name.common}</p>) : (
                      <Highlighter
                      
                        highlightClassName="highlight"
                        searchWords={[searchInput]}
                        autoEscape={true}
                        textToHighlight= {element.name.common}
                      />)  
                      }
                    </Box>

                    <Box
                      mt="1"
                      fontWeight="semibold"
                      as="h4"
                      lineHeight="tight"
                      noOfLines={1}
                    >
                      Population:
                      <span style={{ fontWeight: "normal", marginLeft: "4px" }}>
                        {element.population}
                      </span>
                    </Box>

                    <Box
                      mt="1"
                      fontWeight="semibold"
                      as="h4"
                      lineHeight="tight"
                      noOfLines={1}
                    >
                      Region:
                      <span style={{ fontWeight: "normal", marginLeft: "4px" }}>
                        {element.region}
                      </span>
                    </Box>

                    <Box
                      mt="1"
                      fontWeight="semibold"
                      as="h4"
                      lineHeight="tight"
                      noOfLines={1}
                    >
                      Capital:
                      <span style={{ fontWeight: "normal", marginLeft: "4px" }}>
                        {element.capital}
                      </span>
                    </Box>
                  </Box>
                </Box>
              </GridItem>
            ))}
          </SimpleGrid>

          {/* Stack  */}

          <HStack pt={10} justifyContent={'Center'} >
                        
                     <ReactPaginate 

                      initialPage={activePage}
                      pageCount={page}
                      onClick={(page)=>{
                        setActivePage(page.selected)
                        console.log(page.selected);
                        setIndex(page.selected)

                      }
                        
                      }


                      nextLabel={'next'}
                      previousLabel='previous'
                      breakLabel='...... '
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={4}
                      containerClassName='pagination justify-content-center'
                      pageClassName='page-item'
                      pageLinkClassName='page-link'
                      previousClassName='page-link'
                      nextClassName='page-link'
                      breakClassName='page-link'
                      activeClassName='active'
           

                      
                         />
                      </HStack>
        </Box>
      )}
    </div>
  );
};

export default HomePage;

