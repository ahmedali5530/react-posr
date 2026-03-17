import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Modal } from "@/components/common/react-aria/modal.tsx";
import { Input } from "@/components/common/input/input.tsx";
import { Button } from "@/components/common/input/button.tsx";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import { UserRole } from "@/api/model/user_role.ts";
import { ACCESS_RULE_MODULES, AccessRuleModule } from "@/lib/access.rules.ts";

interface Props {
  open: boolean
  onClose: () => void
  data?: UserRole
}

interface ModuleCheckboxProps {
  module: string;
  moduleConfig: AccessRuleModule;
  level: number;
  selectedModules: string[];
  onChange: (modules: string[]) => void;
  searchTerm?: string;
}

const ModuleCheckbox: React.FC<ModuleCheckboxProps> = ({ 
  module, 
  moduleConfig, 
  level, 
  selectedModules, 
  onChange,
  searchTerm = ""
}) => {
  const isChecked = selectedModules.includes(module);
  const hasChildren = moduleConfig.children.length > 0;

  // Filter children based on search term
  const filteredChildren = moduleConfig.children.filter(child => 
    child.toLowerCase().includes(searchTerm.toLowerCase()) ||
    moduleConfig.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if this module or any of its children match the search
  const matchesSearch = 
    moduleConfig.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filteredChildren.length > 0;

  // If there's a search term and nothing matches, don't render this module
  if (searchTerm && !matchesSearch) {
    return null;
  }

  const handleModuleChange = (checked: boolean) => {
    let newModules = [...selectedModules];
    
    if (checked) {
      newModules.push(module);
    } else {
      newModules = newModules.filter(m => m !== module);
      // Remove all children when parent is unchecked
      moduleConfig.children.forEach(child => {
        newModules = newModules.filter(m => m !== child);
      });
    }
    
    onChange(newModules);
  };

  const handleChildChange = (child: string, checked: boolean) => {
    let newModules = [...selectedModules];
    
    if (checked) {
      newModules.push(child);
      // Ensure parent is selected when child is selected
      if (!newModules.includes(module)) {
        newModules.push(module);
      }
    } else {
      newModules = newModules.filter(m => m !== child);
    }
    
    onChange(newModules);
  };

  return (
    <div className={`${level === 0 ? '' : 'ml-6'}`}>
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          id={module}
          checked={isChecked}
          onChange={(e) => handleModuleChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label 
          htmlFor={module}
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {moduleConfig.label}
        </label>
      </div>
      
      {hasChildren && (
        <div className="mt-2 space-y-2">
          {(searchTerm ? filteredChildren : moduleConfig.children).map((child) => (
            <div key={child} className="flex items-center space-x-2 ml-4">
              <input
                type="checkbox"
                id={child}
                checked={selectedModules.includes(child)}
                onChange={(e) => handleChildChange(child, e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label 
                htmlFor={child}
                className="text-sm text-gray-600 cursor-pointer"
              >
                {child}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const validationSchema = yup.object({
  name: yup.string().required("This is required"),
  roles: yup.array().of(yup.string()).default([]).min(1, "This is required"),
});

export const UserRoleForm = ({ open, onClose, data }: Props) => {
  const db = useDB();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const closeModal = () => {
    onClose();
    reset({
      name: null,
      roles: [],
    });
    setSelectedModules([]);
    setSearchTerm("");
  };

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        name: data.name,
        roles: (data.roles || []),
      });
      setSelectedModules(data.roles || []);
    }
  }, [data, reset]);

  const onSubmit = async (values: any) => {
    const payload = {
      ...values,
      roles: selectedModules,
    };

    try {
      if (payload.id) {
        await db.update(payload.id, payload);
      } else {
        await db.create(Tables.user_roles, payload);
      }
      closeModal();
      toast.success(`Role ${values.name} saved`);
    } catch (e) {
      toast.error(String(e));
      console.log(e);
    }
  };

  return (
    <Modal
      title={data ? `Update ${data.name}` : "Create new role"}
      open={open}
      onClose={closeModal}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 mb-3">
          <div className="flex-1">
            <Input label="Role name" {...register("name")} autoFocus error={errors?.name?.message} />
          </div>
        </div>
        
        <div className="flex-1">
          <label>Modules</label>
          
          {/* Search Box */}
          <div className="mt-2 mb-4">
            <Input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Module Checkboxes */}
          <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {Object.entries(ACCESS_RULE_MODULES).map(([module, moduleConfig]) => (
              <ModuleCheckbox
                key={module}
                module={module}
                moduleConfig={moduleConfig}
                level={0}
                selectedModules={selectedModules}
                onChange={setSelectedModules}
                searchTerm={searchTerm}
              />
            ))}
            
            {searchTerm && Object.entries(ACCESS_RULE_MODULES).every(([, moduleConfig]) => {
              const matchesSearch = 
                moduleConfig.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                moduleConfig.children.some(child => 
                  child.toLowerCase().includes(searchTerm.toLowerCase())
                );
              return !matchesSearch;
            }) && (
              <div className="text-center text-gray-500 py-4">
                No modules found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Button type="submit" variant="primary">Save</Button>
        </div>
      </form>
    </Modal>
  );
};
