export type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image: string;
  details: string;
  parent: unknown;
  type_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  type: {
    id: number;
    name: string;
    slug: string;
    created_at: Date;
    updated_at: Date;
  };
  children: unknown;
};
