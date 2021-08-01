import React from 'react';
import {
  StyledForm,
  StyledInput,
  StyledCategoryName,
  StyledSearchButton,
} from './search-box.style';
import { SearchIcon } from 'assets/icons/search-icon';

interface Props {
  onEnter: (e: React.SyntheticEvent) => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  name: string;
  minimal?: boolean;
  className?: string;
  showButtonText?: boolean;
  shadow?: string;
  [key: string]: unknown;
}

export const SearchBox: React.FC<Props> = ({
  onEnter,
  onChange,
  value,
  name,
  minimal,
  categoryType,
  buttonText,
  className,
  showButtonText = true,
  shadow,
  ...rest
}) => {
  return (
    <StyledForm
      onSubmit={onEnter}
      className={className}
      boxShadow={shadow}
      minimal={minimal}
    >
      {minimal ? (
        <>
          <SearchIcon style={{ marginLeft: 16, marginRight: 16 }} />
          <label htmlFor={`${name}-min`} className='srOnly'>
            Search minimal
          </label>
          <StyledInput
            type='search'
            onChange={onChange}
            id={`${name}-min`}
            value={value}
            name={name}
            {...rest}
          />
        </>
      ) : (
        <>
          <StyledCategoryName>{categoryType}</StyledCategoryName>
          <label htmlFor={`${name}-large`} className='srOnly'>
            Search large
          </label>
          <StyledInput
            type='search'
            onChange={onChange}
            value={value}
            id={`${name}-large`}
            name={name}
            {...rest}
          />
          <StyledSearchButton>
            <SearchIcon style={{ marginRight: 10 }} />
            {showButtonText && buttonText}
          </StyledSearchButton>
        </>
      )}
    </StyledForm>
  );
};
